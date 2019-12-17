require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});
console.log('knex and driver installed correctly');

function searchByTerm(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ilike', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// searchByTerm('burg');

function paginateItems(page) {
  const itemsPerPage = 10;
  const offset = itemsPerPage * (page-1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    })
    .finally(()=> knexInstance.destroy());
}

// paginateItems(3);

function itemsAddedItemsAfterDate(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added', '>',
      knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo)
    )
    .then(result => {
      console.log(result, daysAgo);
    });      
}

// itemsAddedItemsAfterDate(2);

function costForEachCategory() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .sum('price AS totalCount')
    .groupBy('category')
    .then(result => {
      console.log(result);
    });
}
costForEachCategory();