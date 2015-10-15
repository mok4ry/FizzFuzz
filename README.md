# FizzFuzz
Web Fuzzer project for SWEN-331 (Engineering of Secure Software)

## The Authors
Jesse Jurman
Dominic Cicilio
Matt Mokary

## How to Run
You'll need the following things on your machine to start:  
1. Node 4.x

To run the application, navigate to this directory, and run the following:  
1. ```npm install```  
2. ```node fuzz.js <discover | test> <url> <options>```  

The two available commands are `discover` and `test`.  
Test mostly functional, discover might be functional - was working in Release 1.
The url should be a fully formed url, with http or https.  
Options can include custom auth (as described in the proposal).  
