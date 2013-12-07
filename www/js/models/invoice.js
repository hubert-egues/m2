var InvoiceModel = function() {
	var model = this;
	model.message = '';
	model.id_products = 'buyerInventory';
	
	model.success_create = function(client_products) {
		var products = JSON.parse(localStorage.getItem(model.id_products));
		for (var index1 in client_products) {
			product = client_products[index1];
			for (var index in products) {
				if (products[index].id == parseInt(product.id)) {
					products[index].quantity-=product.quantity;
				}
			}
		}
		localStorage.setItem(model.id_products, JSON.stringify(products));
	};

	model.are_valid_products = function(client_products) {
		var products = JSON.parse(localStorage.getItem(model.id_products));
		for (var index1 in client_products) {
			client_product = client_products[index1];
			for (var index in products) {
				if (products[index].id == client_product.id) {
					if (client_product.quantity == 0 || client_product.quantity > products[index].quantity) {
						model.message = 'Ivalid quantity for "' + client_product.model_name + '"';
						return false;
					}					
				}
			}
		}
		return true;
	};
	
	model.get_message = function() {
		var message = model.message;
		model.message = '';
		return message;
	};
	
	model.DESCRIPTION = function() {
		/*...... click al elegir prodcto, pero si tiene variantes lleva a una nueva pantalla, si no tiene variantes pas a invoice  */
		/* desde la pantalla de invoice, cuando se de click al producto nombre se debe lleva r a la pantalla de variante si tuviera, si no no se hace nada */
		/* la nueva pantalla de sub variantes debera regresar siempre a la pantalla de seleccion de productos para el usuario actual (verificar si solo es una ) */
		/* aplicar filtros para items de invoice */
		/* verificar el limpiado de invoice para que no quede rastro anterior de productos (las cantidades anteriores se ven hasta que se cambia de pagina) */
		/* actualizar el envio de data desde view para mobile y el storage local */
		/* verificar offline el procedimiento */
	};
	
	return model;
};