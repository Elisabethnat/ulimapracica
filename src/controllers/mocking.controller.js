import faker from 'faker';

export const generateMockProducts = async (req, res) => {
    try {
        let mockProducts = [];
        for (let i = 0; i < 10; i++) {
            const productData = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                stock: faker.datatype.number({ min: 10, max: 100 }),
                category: faker.commerce.department(),
                status: true,
                code: faker.random.alphaNumeric(10),
                thumbnails: [faker.image.imageUrl()]
            };
            
            mockProducts.push(productData);
        }
        res.json(mockProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};
