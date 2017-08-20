import { Observable } from 'rxjs/Observable';

import { Memoize } from 'typescript-memoize';

// https://github.com/jmdobry/CacheFactory#quick-start
import { CacheFactory } from 'cachefactory';

export class Example {

    private cache;

    constructor() {
        const cacheFactory = new CacheFactory();
        // Check whether cache metadata has been initialized
        // on every page refresh.
        if (!cacheFactory.exists('my-cache')) {
            // Create the cache metadata. Any previously saved
            // data will be loaded.
            this.cache = cacheFactory.createCache('my-cache', {
                // Delete items from the cache when they expire
                deleteOnExpire: 'aggressive',

                // Check for expired items every 60 seconds
                recycleFreq: 60 * 1000
            });
        }
    }

    public expensive(param1: string, param2: string): Observable<string> {

        console.log('key: ' + JSON.stringify([param1, param2]))
        let result = this.cache.get(JSON.stringify([param1, param2]));
        console.log('Loaded result=' + result);
        if (result) {
            return Observable.create(observer => {
                console.log('Loading result from cache');
                observer.next(result);
                observer.complete();
            });
        }

        return Observable.create(observer => {
            console.log('Inside: Calling observable;')
            this.fetchDataFromServer(param2).subscribe((result: string) => {
                let finalResult = "that's a result! + " + result;
                console.log('Caching the result with a key:' + JSON.stringify([param1, param2]));
                this.cache.put(JSON.stringify([param1, param2]), finalResult);
                observer.next(finalResult);
                observer.complete();
            })
        })
        // return Observable.forkJoin([
        //     this.fetchDataFromServer(param2)
        //   ], result)
        //   .map(result => "that's a result! + " + result);
    }

    private fetchDataFromServer(param: string): Observable<string> {
        console.log('Inside: fetching data from observable;')
        return Observable.create(observer => {
            observer.next('param returned from fetch data');
            observer.complete();
        });
    }

    @Memoize((param: string) => {
        return param;
    })
    public notExpensiveAtAll(param: string): string {
        console.log('Inside: calling not expensive at all');
        return 'aaa' + param;
    }
}