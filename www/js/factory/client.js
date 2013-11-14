var ClientFactory = function(urls, token) {
	var factory = {};
	factory.urls = urls;
	factory.token = token;
	factory.id_company_types = 'id_company_types';
	factory.id_client_list = 'clients';
	factory.cache = false;
	
	factory.get_all = function(handler) {
		var client_list = JSON.parse(window.localStorage.getItem(factory.id_client_list));
		if (factory.cache && client_list != null) {
			handler(client_list);
		}
		
		$.ajax({
			url: factory.urls.client_list,
			type: 'POST',
			data: {rp_token: factory.token},
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					window.localStorage.setItem(factory.id_client_list, JSON.stringify(data.list));
					handler(data.list);
				} else {
					handler([]);
				}
			}
	    });
	};
	
	factory.create = function(params, handler) {
		params.rp_token = factory.token;
		$.ajax({
			url: factory.urls.client_create,
			type: 'POST',
			data: params,
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					data.client.name = params.name;
					data.client.image = DOMAIN+'/static/img/designer_default_photo.jpg';
					data.client.type = params.company_type;
					factory.store_client(data.client);
					handler(data.client);
				} else {
					handler(false, data.messages);
				}
			}
	    });
	};
	
	factory.store_client = function(client){
		var client_list = JSON.parse(window.localStorage.getItem(factory.id_client_list));
		client_list[client_list.length] = client;
		window.localStorage.setItem(factory.id_client_list, JSON.stringify(client_list));
	};
	
	factory.get_company_types = function(handler) {
		var types_list = JSON.parse(window.localStorage.getItem(factory.id_company_types));
		if (factory.cache && types_list != null) {
			handler(types_list);
		} 
		
		$.ajax({
			url: factory.urls.client_company_types,
			type: 'POST',
			data: {rp_token: factory.token},
			dataType: 'json',
			success: function(data){
				if (data.status == 'ok') {
					window.localStorage.setItem(factory.id_company_types, JSON.stringify(data.list));
					handler(data.list);
				} else {
					handler([]);
				}
			}
	    });
	};
	
	return factory;
};