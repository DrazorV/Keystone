var __ = require('./dist/iterate.js');

console.log(__);

//console.log(__.map(20, () => __.gen.number(30)));

//console.log(__.index([ 5, 4, 1 ], x => x));

// var ENUM = __.enum({
//     COSTS: __.enum({
//         CREATEUSER: 100,
//         CHANGENAME: 50,
//     }),
// });
// console.log(ENUM.COSTS.CREATEUSER);
// ENUM.COSTS.CREATEUSER += 100;
// console.log(ENUM.COSTS.CREATEUSER);

// console.log('__.options');
// console.log('');
// console.log(__.options({ test: true, adv: { pass: false } }, null));
// console.log(__.options({ test: true, adv: { pass: false } }, { test: false }));

// console.log('__.first');
// console.log('');
// console.log(__.first([ 5, 3, 1, 2, 4 ]));
// console.log(__.first({ f: 2, a: 6, c: 11, d: 12, x: 100 }));
// console.log(__.first([ 5, 3, 1, 2, 4 ], { limit: 3 }));
// console.log(__.first({ f: 2, a: 6, c: 11, d: 12, x: 100 }, { limit: 3 }));

// console.log('__.last');
// console.log('');
// console.log(__.last([ 5, 3, 1, 2, 4 ]));
// console.log(__.last({ f: 2, a: 6, c: 11, d: 12, x: 100 }));
// console.log(__.last([ 5, 3, 1, 2, 4 ], { limit: 3 }));
// console.log(__.last({ f: 2, a: 6, c: 11, d: 12, x: 100 }, { limit: 3 }));

// console.log('__.fuse');
// console.log('');
// console.log(__.fuse({ fish: 'stix', test: { sub: false, high: true } }, { fish: false, test: { high: false } }));
// console.log(__.fuse({ fish: 'stix', test: { sub: false, high: true } }, { fish: false, test: { high: false } }, { deep: true }));

// console.log('__.search');
// console.log('');
// console.log(__.search([ 5, 3, 1, 2, 4 ], 2));
// console.log(__.search([{ a: 20 }, { a: 3 }, { a: 34 }, { a: 1 }, { a: -20 }, { a: 100 }], x => x.a == 3));
// console.log(__.search([{ a: 20 }, { a: 3 }, { a: 34 }, { a: 1 }, { a: -20 }, { a: 100 }], x => x.a == -3), { default: 'fishstix' });

// console.log('__.gen.guid');
// console.log('');
// console.log(__.gen.guid());
// var store = {};
// console.log(__.gen.guid({ map: store }));
// console.log(__.gen.guid({ map: store }));
// console.log(store);

// string.format test simultaneous replace

//console.log('{0}{1}'.format('{1}', '{0}'));

// Distinct Testing

// var intList = [ 1, 1, 2, 3, 3, 4 ];

// console.log(intList);
// console.log(__.distinct(intList));

// var intObj = { key1: 1, key2: 1, key3: 2, key4: 3, key5: 3, key6: 4 };

// console.log(intObj);
// console.log(__.distinct(intObj));

// Intersect Testing

// var intList2 = [ 1, 4, 5 ];
// var intObj2 = { key1: 2, key2: 3, key3: 20 };

// console.log(__.intersect(intList, intList2));
// console.log(__.intersect(intObj, intObj2));

// Type Testing

// console.log(__.is.number(9));
// console.log(__.is.number(0));
// console.log(__.is.nan(NaN));

// console.log('Match Test');

// console.log(__.match({}, []));
// console.log(__.match([ 2, 3, 4 ], [ "2", "3", "4" ]));
// console.log(__.match([ 2, 3, 4 ], [ "2", "3", "4" ], { explicit: true }));
// console.log(__.match({ array: [ 2, 3, 4 ] }, { array: [ "2", "3", "4" ] }));
// console.log(__.match({ array: [ 2, 3, 4 ] }, { array: [ "2", "3", "4" ] }, { explicit: true }));