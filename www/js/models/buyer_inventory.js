var BuyerInventoryModel = function(categoryFactory, buyerInventoryFactory, clientFactory) {
	var model= this;
	model.id_template_variant = 'id_template_option_variant';
	model.id_variants_list = 'id_selected_product_variants_list';
	model.class_btn_selected_variant = 'class_selected_variant';
	model.origin = '';
	model.origin_products = 1;
	model.origin_invoice = 2;
	model.selected_variant_id = 0;

	model.init = function() {
		model.refresh_variants_list();
	};
	
    model.go_to_sub_variant_view = function(product_id) {
    	model.origin = model.origin_products;
    	var product = buyerInventoryFactory.get_by_id(product_id);
    	if (product.variants.length > 0) {
    		model.render_variant_list(product);
    		$.mobile.navigate("#pagina14");
    		return true;
    	} else {
    		model.render_variant_list();
    	}
    	return false;
    };
    
    model.update_variant =  function(product_id, variant_id) {
    	/* TODO: completar */
    	model.selected_variant_id = variant_id;
    	model.origin = model.origin_invoice;
    	model.render_variant_list(product);
    	$.mobile.navigate("#pagina14");
    };
    
    model.render_variant_list = function(product) {
    	$('#'+model.id_variants_list).html('');
    	if (typeof(product.id) !== 'undefined') {
    		for (var index in product.variants) {
        		model.set_variant_to_list(product.variants[index], product.id);
    		}
    	}
		model.refresh_variants_list();
	};

	model.set_variant_to_list = function(variant, inventory_id) {
		var template = $('#'+model.id_template_variant).html();
    	template = template.replace(/__id__/g, variant.id);
    	template = template.replace(/__parent__/g, inventory_id);
    	template = template.replace(/__name__/g, variant.name + ' ' + variant.value);
        $('#'+model.id_variants_list).append(template);

        model.refresh_variants_list();
	};

	model.refresh_variants_list = function() {
		$('#'+model.id_variants_list).trigger('create');
		model.related_event_variant();
	};
	
	model.related_event_variant = function() {
		$('.'+model.class_btn_selected_variant).unbind("click");
		$('.'+model.class_btn_selected_variant).bind("click", function(event){
			model.chose_variant(this);
		});
	};
    
    model.chose_variant = function(obj) {
    	var variant_id = $(obj).data('id');
    	var inventory = buyerInventoryFactory.get_by_id($(obj).data('parent'));
    	var updated = false;
    	/* recorre y agrega , si existe actualiza */
    	client = clientFactory.get_client_selected();
    	for (var i in client.products) {
    		var product = client.products[i];
    		if (product === inventory.id && product.variant_id === variant_id) {
    			updated = true;
    		}
    	}
    	if (!updated) {
    		client.products.push(model.get_product_selected(inventory, variant_id));
    	}
    	
    	if (model.selected_variant_id > 0 && model.selected_variant_id != variant_id) {
    		/* remove product in client selected */
    		var products = [];
    		for (var j in client.products) {
    			if (client.products[j].id == inventory.id && inventory.variant_id == variant_id) {
    				continue;
    			}
    			products.push(client.products[j]);
    		}
    		client.products = products;
    	}
    	
    	clientFactory.set_client_selected(client);
    	/* agregar el valor al producto seleccionado actualmente */
    	/* recalcular el valor mostrado en invoice*/
    	/* verificar que no se repita el valor en el product model */
    	console.log('asdasdasds ok')
    	/* utilicar go back de jmobile para regresar */
    	window.history.back();
    };
    
    model.get_product_selected = function(product, variant_id) {
    	var productSelected = {
            'id': product.id,
            'product_name': product.product_name,
            'model_name': product.model_name,
            'quantity': product.quantity,
            'price': model.calculate_price_by_client_selected(product, variant_id),
            'model_image': product.model_image,
            'discount': model.get_discount_id_by_client_selected(product),
            'variant_id': variant_id
        };
    	return productSelected;
    };
    
    model.calculate_price_by_client_selected = function(inventory, variant_id) {
    	var clientSelected = clientFactory.get_client_selected();
        var price = 0;
        var variant_value = 0;
        if(clientSelected.type === 1) {/* business client -> wholesale */            
            price = parseFloat(inventory.wholesale_price);
        }
        else if(clientSelected.type === 2) {/* business client -> wholesale */
            price = parseFloat(inventory.retail_price);
            if (typeof(inventory.clients_discount) != 'undefined') {                
	            if (typeof(inventory.clients_discount[clientSelected.id]) != 'undefined') {
	        		price = parseFloat(inventory.clients_discount[clientSelected.id].amount);
	        	}
            }
        }
        
        if (!isNaN(parseInt(variant_id)) && parseInt(variant_id) > 0) {
        	for (var index in inventory.variants) {
        		var variant = inventory.variants[index];
        		if (variant.id == parseInt(variant_id)) {
        			variant_value = parseFloat(variant.additional_cost);
        		}
        	}
        }

        price = price + variant_value;
        return price.toFixed(2);
    };
    
    model.get_discount_id_by_client_selected = function(inventory) {
    	var discount = 0;
    	var clientSelected = clientFactory.get_client_selected();
    	if(clientSelected.type === 2) {
            if (typeof(inventory.clients_discount[clientSelected.id]) != 'undefined') {
            	discount = inventory.clients_discount[clientSelected.id].id;
        	}
        }
    	return discount;
    };

    return model;
};