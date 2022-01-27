import { LightningElement, wire, track } from 'lwc';
import getExchangeRates from '@salesforce/apex/FixerCallout.getExchangeRates';

export default class LwcRestCallOut extends LightningElement {
	rates = [];
	rateSymbol;
	rateValue;

	//data for custom searchbox
	codes = JSON.stringify({"values": [
		{'Id' : 2, 'Code': 'AED', 'Name': 'United Arab Emirates Dirham'},
		{'Id' : 3, 'Code': 'AFN', 'Name': 'Afghan Afghani'},
		{'Id' : 4, 'Code': 'ALL', 'Name': 'Albanian Lek'},
		{'Id' : 5, 'Code': 'AMD', 'Name': 'Armenian Dram'},
		{'Id' : 6, 'Code': 'ANG', 'Name': 'Netherlands Antillean Guilder'},
		{'Id' : 7, 'Code': 'AOA', 'Name': 'Angolan Kwanza'},
		{'Id' : 8, 'Code': 'ARS', 'Name': 'Argentine Peso'},
		{'Id' : 9, 'Code': 'AUD', 'Name': 'Australian Dollar'},
		{'Id' : 10, 'Code': 'AWG', 'Name': 'Aruban Florin'},
		{'Id' : 11, 'Code': 'AZN', 'Name': 'Azerbaijani Manat'},
		{'Id' : 12, 'Code': 'BAM', 'Name': 'Bosnia-Herzegovina Convertible Mark'},
		{'Id' : 13, 'Code': 'BBD', 'Name': 'Barbadian Dollar'},
		{'Id' : 14, 'Code': 'BDT', 'Name': 'Bangladeshi Taka'},
		{'Id' : 15, 'Code': 'BGN', 'Name': 'Bulgarian Lev'},
		{'Id' : 16, 'Code': 'BHD', 'Name': 'Bahraini Dinar'},
		{'Id' : 17, 'Code': 'BIF', 'Name': 'Burundian Franc'},
		{'Id' : 18, 'Code': 'BMD', 'Name': 'Bermudan Dollar'},
		{'Id' : 19, 'Code': 'BND', 'Name': 'Brunei Dollar'},
		{'Id' : 20, 'Code': 'BOB', 'Name': 'Bolivian Boliviano'},
		{'Id' : 21, 'Code': 'BRL', 'Name': 'Brazilian Real'},
		{'Id' : 22, 'Code': 'BSD', 'Name': 'Bahamian Dollar'},
		{'Id' : 23, 'Code': 'BTC', 'Name': 'Bitcoin'},
		{'Id' : 24, 'Code': 'BTN', 'Name': 'Bhutanese Ngultrum'},
		{'Id' : 25, 'Code': 'BWP', 'Name': 'Botswanan Pula'},
		{'Id' : 26, 'Code': 'BYN', 'Name': 'New Belarusian Ruble'},
		{'Id' : 27, 'Code': 'BYR', 'Name': 'Belarusian Ruble'},
		{'Id' : 28, 'Code': 'BZD', 'Name': 'Belize Dollar'},
		{'Id' : 29, 'Code': 'CAD', 'Name': 'Canadian Dollar'},
		{'Id' : 30, 'Code': 'CDF', 'Name': 'Congolese Franc'},
		{'Id' : 31, 'Code': 'CHF', 'Name': 'Swiss Franc'},
		{'Id' : 32, 'Code': 'CLF', 'Name': 'Chilean Unit of Account (UF)'},
		{'Id' : 33, 'Code': 'CLP', 'Name': 'Chilean Peso'},
		{'Id' : 34, 'Code': 'CNY', 'Name': 'Chinese Yuan'},
		{'Id' : 35, 'Code': 'COP', 'Name': 'Colombian Peso'},
		{'Id' : 36, 'Code': 'CRC', 'Name': 'Costa Rican Col\u00f3n'},
		{'Id' : 37, 'Code': 'CUC', 'Name': 'Cuban Convertible Peso'},
		{'Id' : 38, 'Code': 'CUP', 'Name': 'Cuban Peso'},
		{'Id' : 39, 'Code': 'CVE', 'Name': 'Cape Verdean Escudo'},
		{'Id' : 40, 'Code': 'CZK', 'Name': 'Czech Republic Koruna'},
		{'Id' : 41, 'Code': 'DJF', 'Name': 'Djiboutian Franc'},
		{'Id' : 42, 'Code': 'DKK', 'Name': 'Danish Krone'},
		{'Id' : 43, 'Code': 'DOP', 'Name': 'Dominican Peso'},
		{'Id' : 44, 'Code': 'DZD', 'Name': 'Algerian Dinar'},
		{'Id' : 45, 'Code': 'EGP', 'Name': 'Egyptian Pound'},
		{'Id' : 46, 'Code': 'ERN', 'Name': 'Eritrean Nakfa'},
		{'Id' : 47, 'Code': 'ETB', 'Name': 'Ethiopian Birr'},
		{'Id' : 48, 'Code': 'EUR', 'Name': 'Euro'},
		{'Id' : 49, 'Code': 'FJD', 'Name': 'Fijian Dollar'},
		{'Id' : 50, 'Code': 'FKP', 'Name': 'Falkland Islands Pound'},
		{'Id' : 51, 'Code': 'GBP', 'Name': 'British Pound Sterling'},
		{'Id' : 52, 'Code': 'GEL', 'Name': 'Georgian Lari'},
		{'Id' : 53, 'Code': 'GGP', 'Name': 'Guernsey Pound'},
		{'Id' : 54, 'Code': 'GHS', 'Name': 'Ghanaian Cedi'},
		{'Id' : 55, 'Code': 'GIP', 'Name': 'Gibraltar Pound'},
		{'Id' : 56, 'Code': 'GMD', 'Name': 'Gambian Dalasi'},
		{'Id' : 57, 'Code': 'GNF', 'Name': 'Guinean Franc'},
		{'Id' : 58, 'Code': 'GTQ', 'Name': 'Guatemalan Quetzal'},
		{'Id' : 59, 'Code': 'GYD', 'Name': 'Guyanaese Dollar'},
		{'Id' : 60, 'Code': 'HKD', 'Name': 'Hong Kong Dollar'},
		{'Id' : 61, 'Code': 'HNL', 'Name': 'Honduran Lempira'},
		{'Id' : 62, 'Code': 'HRK', 'Name': 'Croatian Kuna'},
		{'Id' : 63, 'Code': 'HTG', 'Name': 'Haitian Gourde'},
		{'Id' : 64, 'Code': 'HUF', 'Name': 'Hungarian Forint'},
		{'Id' : 65, 'Code': 'IDR', 'Name': 'Indonesian Rupiah'},
		{'Id' : 66, 'Code': 'ILS', 'Name': 'Israeli New Sheqel'},
		{'Id' : 67, 'Code': 'IMP', 'Name': 'Manx pound'},
		{'Id' : 68, 'Code': 'INR', 'Name': 'Indian Rupee'},
		{'Id' : 69, 'Code': 'IQD', 'Name': 'Iraqi Dinar'},
		{'Id' : 70, 'Code': 'IRR', 'Name': 'Iranian Rial'},
		{'Id' : 71, 'Code': 'ISK', 'Name': 'Icelandic Kr\u00f3na'},
		{'Id' : 72, 'Code': 'JEP', 'Name': 'Jersey Pound'},
		{'Id' : 73, 'Code': 'JMD', 'Name': 'Jamaican Dollar'},
		{'Id' : 74, 'Code': 'JOD', 'Name': 'Jordanian Dinar'},
		{'Id' : 75, 'Code': 'JPY', 'Name': 'Japanese Yen'},
		{'Id' : 76, 'Code': 'KES', 'Name': 'Kenyan Shilling'},
		{'Id' : 77, 'Code': 'KGS', 'Name': 'Kyrgystani Som'},
		{'Id' : 78, 'Code': 'KHR', 'Name': 'Cambodian Riel'},
		{'Id' : 79, 'Code': 'KMF', 'Name': 'Comorian Franc'},
		{'Id' : 80, 'Code': 'KPW', 'Name': 'North Korean Won'},
		{'Id' : 81, 'Code': 'KRW', 'Name': 'South Korean Won'},
		{'Id' : 82, 'Code': 'KWD', 'Name': 'Kuwaiti Dinar'},
		{'Id' : 83, 'Code': 'KYD', 'Name': 'Cayman Islands Dollar'},
		{'Id' : 84, 'Code': 'KZT', 'Name': 'Kazakhstani Tenge'},
		{'Id' : 85, 'Code': 'LAK', 'Name': 'Laotian Kip'},
		{'Id' : 86, 'Code': 'LBP', 'Name': 'Lebanese Pound'},
		{'Id' : 87, 'Code': 'LKR', 'Name': 'Sri Lankan Rupee'},
		{'Id' : 88, 'Code': 'LRD', 'Name': 'Liberian Dollar'},
		{'Id' : 89, 'Code': 'LSL', 'Name': 'Lesotho Loti'},
		{'Id' : 90, 'Code': 'LTL', 'Name': 'Lithuanian Litas'},
		{'Id' : 91, 'Code': 'LVL', 'Name': 'Latvian Lats'},
		{'Id' : 92, 'Code': 'LYD', 'Name': 'Libyan Dinar'},
		{'Id' : 93, 'Code': 'MAD', 'Name': 'Moroccan Dirham'},
		{'Id' : 94, 'Code': 'MDL', 'Name': 'Moldovan Leu'},
		{'Id' : 95, 'Code': 'MGA', 'Name': 'Malagasy Ariary'},
		{'Id' : 96, 'Code': 'MKD', 'Name': 'Macedonian Denar'},
		{'Id' : 97, 'Code': 'MMK', 'Name': 'Myanma Kyat'},
		{'Id' : 98, 'Code': 'MNT', 'Name': 'Mongolian Tugrik'},
		{'Id' : 99, 'Code': 'MOP', 'Name': 'Macanese Pataca'},
		{'Id' : 100, 'Code': 'MRO', 'Name': 'Mauritanian Ouguiya'},
		{'Id' : 101, 'Code': 'MUR', 'Name': 'Mauritian Rupee'},
		{'Id' : 102, 'Code': 'MVR', 'Name': 'Maldivian Rufiyaa'},
		{'Id' : 103, 'Code': 'MWK', 'Name': 'Malawian Kwacha'},
		{'Id' : 104, 'Code': 'MXN', 'Name': 'Mexican Peso'},
		{'Id' : 105, 'Code': 'MYR', 'Name': 'Malaysian Ringgit'},
		{'Id' : 106, 'Code': 'MZN', 'Name': 'Mozambican Metical'},
		{'Id' : 107, 'Code': 'NAD', 'Name': 'Namibian Dollar'},
		{'Id' : 108, 'Code': 'NGN', 'Name': 'Nigerian Naira'},
		{'Id' : 109, 'Code': 'NIO', 'Name': 'Nicaraguan C\u00f3rdoba'},
		{'Id' : 110, 'Code': 'NOK', 'Name': 'Norwegian Krone'},
		{'Id' : 111, 'Code': 'NPR', 'Name': 'Nepalese Rupee'},
		{'Id' : 112, 'Code': 'NZD', 'Name': 'New Zealand Dollar'},
		{'Id' : 113, 'Code': 'OMR', 'Name': 'Omani Rial'},
		{'Id' : 114, 'Code': 'PAB', 'Name': 'Panamanian Balboa'},
		{'Id' : 115, 'Code': 'PEN', 'Name': 'Peruvian Nuevo Sol'},
		{'Id' : 116, 'Code': 'PGK', 'Name': 'Papua New Guinean Kina'},
		{'Id' : 117, 'Code': 'PHP', 'Name': 'Philippine Peso'},
		{'Id' : 118, 'Code': 'PKR', 'Name': 'Pakistani Rupee'},
		{'Id' : 119, 'Code': 'PLN', 'Name': 'Polish Zloty'},
		{'Id' : 120, 'Code': 'PYG', 'Name': 'Paraguayan Guarani'},
		{'Id' : 121, 'Code': 'QAR', 'Name': 'Qatari Rial'},
		{'Id' : 122, 'Code': 'RON', 'Name': 'Romanian Leu'},
		{'Id' : 123, 'Code': 'RSD', 'Name': 'Serbian Dinar'},
		{'Id' : 124, 'Code': 'RUB', 'Name': 'Russian Ruble'},
		{'Id' : 125, 'Code': 'RWF', 'Name': 'Rwandan Franc'},
		{'Id' : 126, 'Code': 'SAR', 'Name': 'Saudi Riyal'},
		{'Id' : 127, 'Code': 'SBD', 'Name': 'Solomon Islands Dollar'},
		{'Id' : 128, 'Code': 'SCR', 'Name': 'Seychellois Rupee'},
		{'Id' : 129, 'Code': 'SDG', 'Name': 'Sudanese Pound'},
		{'Id' : 130, 'Code': 'SEK', 'Name': 'Swedish Krona'},
		{'Id' : 131, 'Code': 'SGD', 'Name': 'Singapore Dollar'},
		{'Id' : 132, 'Code': 'SHP', 'Name': 'Saint Helena Pound'},
		{'Id' : 133, 'Code': 'SLL', 'Name': 'Sierra Leonean Leone'},
		{'Id' : 134, 'Code': 'SOS', 'Name': 'Somali Shilling'},
		{'Id' : 135, 'Code': 'SRD', 'Name': 'Surinamese Dollar'},
		{'Id' : 136, 'Code': 'STD', 'Name': 'S\u00e3o Tom\u00e9 and Pr\u00edncipe Dobra'},
		{'Id' : 137, 'Code': 'SVC', 'Name': 'Salvadoran Col\u00f3n'},
		{'Id' : 138, 'Code': 'SYP', 'Name': 'Syrian Pound'},
		{'Id' : 139, 'Code': 'SZL', 'Name': 'Swazi Lilangeni'},
		{'Id' : 140, 'Code': 'THB', 'Name': 'Thai Baht'},
		{'Id' : 141, 'Code': 'TJS', 'Name': 'Tajikistani Somoni'},
		{'Id' : 142, 'Code': 'TMT', 'Name': 'Turkmenistani Manat'},
		{'Id' : 143, 'Code': 'TND', 'Name': 'Tunisian Dinar'},
		{'Id' : 144, 'Code': 'TOP', 'Name': 'Tongan Pa\u02bbanga'},
		{'Id' : 145, 'Code': 'TRY', 'Name': 'Turkish Lira'},
		{'Id' : 146, 'Code': 'TTD', 'Name': 'Trinidad and Tobago Dollar'},
		{'Id' : 147, 'Code': 'TWD', 'Name': 'New Taiwan Dollar'},
		{'Id' : 148, 'Code': 'TZS', 'Name': 'Tanzanian Shilling'},
		{'Id' : 149, 'Code': 'UAH', 'Name': 'Ukrainian Hryvnia'},
		{'Id' : 150, 'Code': 'UGX', 'Name': 'Ugandan Shilling'},
		{'Id' : 151, 'Code': 'USD', 'Name': 'United States Dollar'},
		{'Id' : 152, 'Code': 'UYU', 'Name': 'Uruguayan Peso'},
		{'Id' : 153, 'Code': 'UZS', 'Name': 'Uzbekistan Som'},
		{'Id' : 154, 'Code': 'VEF', 'Name': 'Venezuelan Bol\u00edvar Fuerte'},
		{'Id' : 155, 'Code': 'VND', 'Name': 'Vietnamese Dong'},
		{'Id' : 156, 'Code': 'VUV', 'Name': 'Vanuatu Vatu'},
		{'Id' : 157, 'Code': 'WST', 'Name': 'Samoan Tala'},
		{'Id' : 158, 'Code': 'XAF', 'Name': 'CFA Franc BEAC'},
		{'Id' : 159, 'Code': 'XAG', 'Name': 'Silver (troy ounce)'},
		{'Id' : 160, 'Code': 'XAU', 'Name': 'Gold (troy ounce)'},
		{'Id' : 161, 'Code': 'XCD', 'Name': 'East Caribbean Dollar'},
		{'Id' : 162, 'Code': 'XDR', 'Name': 'Special Drawing Rights'},
		{'Id' : 163, 'Code': 'XOF', 'Name': 'CFA Franc BCEAO'},
		{'Id' : 164, 'Code': 'XPF', 'Name': 'CFP Franc'},
		{'Id' : 165, 'Code': 'YER', 'Name': 'Yemeni Rial'},
		{'Id' : 166, 'Code': 'ZAR', 'Name': 'South African Rand'},
		{'Id' : 167, 'Code': 'ZMK', 'Name': 'Zambian Kwacha (pre-2013)'},
		{'Id' : 168, 'Code': 'ZMW', 'Name': 'Zambian Kwacha'},
		{'Id' : 169, 'Code': 'ZWL', 'Name': 'Zimbabwean Dollar'}
	]});
	@track searchFields = ['Code'];
	@track displayFields = ['Code', 'Name'];

	//wire getExchangeRates method from apex to rates variable
	@wire(getExchangeRates)
    wiredRates({error, data }) {
        if (data) {
			this.rates = data;
			console.log(data);
        }
		else if (error) {
			console.log(error);
		}
    }

	//handler for button
	handleGetExchangeRate(event) {
		console.log('The rates are: ');
		console.log(this.rates);
		//console.log('Rate value is: ');
		//console.log(this.rates[this.rateSymbol]);
	}
	
	//handler for lightning-input and also combobox
	handleInputChange(event) {
        this.rateSymbol = event.detail.value;
		this.rateValue = this.rates[this.rateSymbol];
    }

	//convert rates into acceptable options format for combobox
	get options() {
		var ratesArray = Object.keys(this.rates);
    	var returnOptions = [];

		ratesArray.forEach(key =>{
			returnOptions.push({label:key , value:key});
		}); 

		//console.log(JSON.stringify(returnOptions));
		return returnOptions;
	}	

	//handler for custom searchbox
	handleLookup (event) {
		this.rateSymbol = event.detail.data.record.Code;
		this.rateValue = this.rates[this.rateSymbol];
		// console.log(event.detail.data.recordId);
		// console.log(event.detail.data.record); // object from the array
		// console.log(event.detail.data.deleting); // if we are deleting the value
	}
}
