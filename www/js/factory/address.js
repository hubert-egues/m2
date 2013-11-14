var CountryFactory = function(urls, token) {
	var factory = {};

	factory.cache = true;
	factory.urls = urls;
	factory.token = token;
	factory.id_countries = 'id_countries';
	
	factory.get_all = function(handler) {
		var list = JSON.parse(window.localStorage.getItem(factory.id_countries));
		if (factory.cache && list != null) {
			handler(list);
		} 
		
		$.ajax({
			url: factory.urls.countries,
			type: 'POST',
			data: {rp_token: factory.token},
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					window.localStorage.setItem(factory.id_countries, JSON.stringify(data.list));
					handler(data.list);
				} else {
					return handler([]);
				}
			}
	    });
	};
	return factory;
};

var StateFactory = function(urls, token) {
	var factory = {};
	
	factory.cache = true;
	factory.urls = urls;
	factory.token = token;
	factory.id_states = 'id_states';

	factory.get_by_country = function(country,  handler){
		var list = JSON.parse(window.localStorage.getItem(factory.id_states+country));
		if (factory.cache && list != null) {
			handler(list);
		} 
		
		$.ajax({
			url: factory.urls.states_by_country,
			type: 'POST',
			data: {rp_token: factory.token, country: country},
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					window.localStorage.setItem(factory.id_states+country, JSON.stringify(data.list));
					handler(data.list);
				} else {
					return handler([]);
				}
			}
	    });
	};

	return factory;
};

var CityFactory = function(urls, token) {
	var factory = {};

	factory.cache = true;
	factory.urls = urls;
	factory.token = token;
	factory.id_cities = 'id_cities';

	factory.get_by_char = function(state, handler){
		window.localStorage.removeItem(factory.id_cities+state);
		var list = JSON.parse(window.localStorage.getItem(factory.id_cities+state));
		if (factory.cache && list != null) {
			handler(list);
		} 
		
		$.ajax({
			url: factory.urls.cities_by_char,
			type: 'POST',
			data: {rp_token: factory.token, state: state},
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					window.localStorage.setItem(factory.id_cities+state, JSON.stringify(data.list));
					handler(data.list);
				} else {
					return handler([]);
				}
			}
	    });
	};
	return factory;
};