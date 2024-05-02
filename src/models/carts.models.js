import { Schema, model } from 'mongoose';
import paginate  from 'mongoose-paginate-v2';

const cartSchema = new Schema({
		products: {
			type: [
					{
						id_prod: { 
							type: Schema.Types.ObjectId, // tipo id autogenerado de mongoDb
							ref: 'products',
							required: true,
						},
						quantity: {
							type: Number,
							required: true,
						},
					},
				],
				default: function () {
					return [];
				},
			}		
		});
		//esto es el populate para que traiga el objeto completo. Usamos el concepto de pre, previo a generar el modelo agregro la configuracion
		cartSchema.pre('find', function () { //utilizo findOne porque es un solo carrito
				this.populate('products.id_prod')		
		});

		cartSchema.plugin(paginate);

const cartModel = model('carts', cartSchema);
export default cartModel;