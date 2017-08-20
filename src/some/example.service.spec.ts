import { Example } from './example.service';

describe('Example', () => {

    describe('GUID generator, createGuide', () => {

        let exampleService: Example = new Example();

        it("caching observable", () => {
            exampleService.expensive('a', 'b.').subscribe(result =>
                console.log('Result from test:' + result)
            );
            console.log('should be cashed at this point');
            exampleService.expensive('a', 'b.').subscribe(result =>
                console.log('Result from test:' + result)                
            );
        });

        it("caching non observable", () => {
            console.log(exampleService.notExpensiveAtAll(' some string'));
            console.log(exampleService.notExpensiveAtAll(' some string'));
        });
    });

});