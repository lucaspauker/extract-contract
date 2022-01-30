# extract-contract

## How to run the code
### Set up conda env
```
conda env create -f api/env.yml
```
### Run frontend server
```
cd frontend
npm start
```
### Run backend server
```
cd api
flask run
```

## Do this before committing
```
conda env export > api/env.yml
```
