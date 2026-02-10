const products = [
    // Vegetables
    {
        name: 'Fresh Tomato',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        description: 'Fresh organic tomatoes directly from the farm.',
        category: 'Vegetables',
        price: 40,
        countInStock: 50,
        unit: 'kg'
    },
    {
        name: 'Potato',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        description: 'High quality potatoes, perfect for detailed cooking.',
        category: 'Vegetables',
        price: 30,
        countInStock: 100,
        unit: 'kg'
    },
    {
        name: 'Red Onion',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
        description: 'Fresh red onions to add flavor to your dishes.',
        category: 'Vegetables',
        price: 35,
        countInStock: 80,
        unit: 'kg'
    },
    {
        name: 'Broccoli',
        image: 'https://tse1.mm.bing.net/th/id/OIP.Iwpd-0C3ziKGXuYSTMATxgHaE6?pid=Api&P=0&h=220',
        description: 'Nutritious green broccoli florets.',
        category: 'Vegetables',
        price: 120,
        countInStock: 20,
        unit: 'kg'
    },
    {
        name: 'Spinach',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
        description: 'Fresh green spinach leaves, rich in iron.',
        category: 'Vegetables',
        price: 25,
        countInStock: 40,
        unit: 'bunch'
    },
    {
        name: 'Carrot',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
        description: 'Crunchy orange carrots, sweet and healthy.',
        category: 'Vegetables',
        price: 50,
        countInStock: 60,
        unit: 'kg'
    },
    {
        name: 'Capsicum',
        image: 'https://cdn.pixabay.com/photo/2024/07/08/02/17/capsicum-8879943_1280.jpg',
        description: 'Fresh green capsicum for salads and cooking.',
        category: 'Vegetables',
        price: 60,
        countInStock: 40,
        unit: 'kg'
    },
    // Fruits
    {
        name: 'Apple',
        image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
        description: 'Fresh red apples from Kashmir.',
        category: 'Fruits',
        price: 150,
        countInStock: 40,
        unit: 'kg'
    },
    {
        name: 'Banana',
        image: 'https://edunovations.com/notes/wp-content/uploads/2023/05/Banana.webp',
        description: 'Sweet and nutritious bananas.',
        category: 'Fruits',
        price: 40,
        countInStock: 100,
        unit: 'dozen'
    },
    {
        name: 'Mango',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
        description: 'King of fruits, sweet and juicy Alphonsos.',
        category: 'Fruits',
        price: 250,
        countInStock: 30,
        unit: 'dozen'
    },
    {
        name: 'Orange',
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
        description: 'Citrusy oranges packed with Vitamin C.',
        category: 'Fruits',
        price: 80,
        countInStock: 60,
        unit: 'kg'
    },
    {
        name: 'Grapes',
        image: 'https://tse4.mm.bing.net/th/id/OIP.8LR5I9E1Uz2C_dJqhYew1QHaEK?pid=Api&P=0&h=220',
        description: 'Sweet and tangy green grapes.',
        category: 'Fruits',
        price: 90,
        countInStock: 45,
        unit: 'kg'
    },
    // Dairy
    {
        name: 'Milk',
        image: 'https://ohmyfacts.com/wp-content/uploads/2024/05/12-must-know-nutrition-facts-about-milk-1714626868.jpg',
        description: 'Fresh organic cow milk.',
        category: 'Dairy',
        price: 60,
        countInStock: 50,
        unit: 'liter'
    },
    {
        name: 'Cheese Block',
        image: 'https://tse3.mm.bing.net/th/id/OIP._7BRn8YkApQ7XoV01VKtQQHaE8?pid=Api&P=0&h=220',
        description: 'Processed cheese block for sandwiches and pizza.',
        category: 'Dairy',
        price: 120,
        countInStock: 40,
        unit: 'block'
    },
    {
        name: 'Butter',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
        description: 'Salted butter for cooking and baking.',
        category: 'Dairy',
        price: 55,
        countInStock: 60,
        unit: 'pack'
    },
    {
        name: 'Yogurt',
        image: 'https://images.unsplash.com/photo-1562114808-b4b33cf60f4f?auto=format&fit=crop&w=800&q=80',
        description: 'Creamy and thick natural yogurt.',
        category: 'Dairy',
        price: 40,
        countInStock: 30,
        unit: 'cup'
    },
    // Grains
    {
        name: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        description: 'Premium long grain Basmati rice.',
        category: 'Grains',
        price: 90,
        countInStock: 100,
        unit: 'kg'
    },
    {
        name: 'Wheat Flour',
        image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=800&q=80',
        description: 'Whole wheat flour for soft rotis.',
        category: 'Grains',
        price: 45,
        countInStock: 80,
        unit: 'kg'
    },
    {
        name: 'Toor Dal',
        image: 'https://cdn.shopify.com/s/files/1/0251/6942/8589/products/image_a1c8553b-bcdb-487e-9cc7-d871ed606c13_1024x1024@2x.jpg?v=1586286392',
        description: 'Polished Toor Dal rich in protein.',
        category: 'Grains',
        price: 110,
        countInStock: 60,
        unit: 'kg'
    },
    // Snacks
    {
        name: 'Chocolate Chip Cookies',
        image: 'https://tse1.mm.bing.net/th/id/OIP.plvdM9YV6UF_qc6Gc2SYgwHaI9?pid=Api&P=0&h=220',
        description: 'Crunchy cookies with real chocolate chips.',
        category: 'Snacks',
        price: 50,
        countInStock: 50,
        unit: 'pack'
    },
    {
        name: 'Potato Chips',
        image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=800&q=80',
        description: 'Crispy salted potato chips.',
        category: 'Snacks',
        price: 20,
        countInStock: 100,
        unit: 'pack'
    },
    {
        name: 'Vanilla Ice Cream',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        description: 'Creamy vanilla ice cream tub.',
        category: 'Snacks',
        price: 180,
        countInStock: 15,
        unit: 'tub'
    },
    {
        name: 'Dark Chocolate',
        image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
        description: 'Rich dark chocolate bar.',
        category: 'Snacks',
        price: 120,
        countInStock: 40,
        unit: 'bar'
    },
    {
        name: 'Cauliflower',
        image: 'https://cdn.pixabay.com/photo/2016/05/12/16/34/cauliflower-1388002_1280.jpg',
        description: 'Fresh white cauliflower florets.',
        category: 'Vegetables',
        price: 45,
        countInStock: 40,
        unit: 'kg'
    },
    {
        name: 'Cucumber',
        image: 'https://cdn.pixabay.com/photo/2015/07/17/13/44/cucumbers-849269_1280.jpg',
        description: 'Cool and crisp cucumbers.',
        category: 'Vegetables',
        price: 30,
        countInStock: 60,
        unit: 'kg'
    },
    {
        name: 'Watermelon',
        image: 'https://cdn.pixabay.com/photo/2016/07/21/09/27/watermelon-1532053_1280.jpg',
        description: 'Sweet and juicy red watermelon.',
        category: 'Fruits',
        price: 50,
        countInStock: 30,
        unit: 'kg'
    },
    {
        name: 'Pineapple',
        image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/pineapple-1238238_1280.jpg',
        description: 'Tropical sweet pineapple.',
        category: 'Fruits',
        price: 80,
        countInStock: 40,
        unit: 'pc'
    },
    {
        name: 'Paneer',
        image: 'https://tse3.mm.bing.net/th/id/OIP.aJ8Y3Ewq3gXk4gXk4gXk4gHaE8?pid=Api&P=0&h=220',
        description: 'Fresh and soft cottage cheese.',
        category: 'Dairy',
        price: 350,
        countInStock: 25,
        unit: 'kg'
    },
    {
        name: 'Moong Dal',
        image: 'https://tse4.mm.bing.net/th/id/OIP.D9a9999999999999999999HaE8?pid=Api&P=0&h=220',
        description: 'Split yellow moong beans.',
        category: 'Grains',
        price: 130,
        countInStock: 50,
        unit: 'kg'
    },
    {
        name: 'Popcorn',
        image: 'https://cdn.pixabay.com/photo/2015/05/04/10/16/vegetables-752153_1280.jpg',
        description: 'Buttery movie style popcorn.',
        category: 'Snacks',
        price: 85,
        countInStock: 100,
        unit: 'pack'
    }
];

// Add images array to all products
products.forEach(product => {
    product.images = [product.image];
});

module.exports = products;
