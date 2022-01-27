public with sharing class FixerCallout {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getExchangeRates() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://data.fixer.io/api/latest?access_key=0b2f94cf541e1979f5bca5c05531614f');
        request.setMethod('GET');
        HttpResponse response = http.send(request);

        Map<String, Object> rates;

        // If the request is successful, parse the JSON response.
        if(response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            // Cast the values in the 'rates' key as a map
            rates = (Map<String, Object>) results.get('rates');

            System.debug('Received the following rates:' + rates);
        }

        return rates;
    }
}
