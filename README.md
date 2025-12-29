# point-of-sale
A Point of Sale software for managing sales and item stocks

## Running and testing the app
- To run the Spring application
```bash
cd backend/
./mvnw spring-boot:run
```

- To run tests
```bash
cd backend/
./mvnw clean test
```

- To generate a code coverage report
```bash
cd backend/
./mvnw clean verify
```

- To generate a [mutation test](https://pitest.org/) report
```bash
cd backend/
./mvnw clean test
./mvnw org.pitest:pitest-maven:mutationCoverage
```