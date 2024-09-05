const {  setTimeout  } = require('node:timers/promises');
const puppeteer = require('puppeteer');
const fs = require('fs');

const url = process.argv[2]; // Ссылка на товар
const region = process.argv[3]; // Регион

if (!url || !region) {
    console.error('Please provide a product URL and a region.');
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Переходим на страницу товара
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Ждем 5 секунд
    await setTimeout(5000);

    // Задаем селекторы для извлечения данных
    const priceSelector = '.Price_size_XL__MHvC1'; 
    const oldPriceSelector = '.Price_price__QzA8L'; 
    const ratingSelector = '.ActionsRow_stars__EKt42';
    const reviewsCountSelector = '.ActionsRow_reviews__AfSj_';

    // Получаем данные
    const currentPrice = await page.$eval(priceSelector, el => el.textContent.trim()).catch(() => 'Не указана');
    const oldPrice = await page.$eval(oldPriceSelector, el => el.textContent.trim()).catch(() => 'Не указана');
    const rating = await page.$eval(ratingSelector, el => el.textContent.trim()).catch(() => 'Не указана');
    const reviewsCount = await page.$eval(reviewsCountSelector, el => el.textContent.trim()).catch(() => 'Не указано');

    // Сохранение скриншота
    await page.screenshot({ path: 'screenshot.jpg', fullPage: true });

    // Форматируем и сохраняем информацию о товаре
    const productInfo = `
    URL: ${url}
    Регионы: ${region}
    Текущая цена: ${currentPrice}
    Старая цена: ${oldPrice}
    Рейтинг: ${rating}
    Количество отзывов: ${reviewsCount}
    `;

    fs.writeFileSync('product.txt', productInfo.trim());

    await browser.close();
    console.log('Скриншот и информация о продукте успешно сохранены!');
})();