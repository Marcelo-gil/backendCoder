import { faker } from "@faker-js/faker/locale/es";

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [ faker.image.image()],
        code: faker.random.alphaNumeric(10),
        stock: faker.random.numeric(1),
        status: true,
        category: faker.commerce.productMaterial()
    }
}

export {
    generateProduct
}