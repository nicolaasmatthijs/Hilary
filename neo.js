var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var nodes = [db.createNode({'name': 'Branden', 'type': 'User'}), 
             db.createNode({'name': 'OAE Team', 'type': 'Group'}),
             db.createNode({'name': 'Back-end Team', 'type': 'Group'}),
             db.createNode({'name': 'UI Team', 'type': 'Group'}),
             db.createNode({'name': 'Test.pdf', 'type': 'Content'})];

var saveNodes = function(nodes) {
    var done = 0;
    var saveNode = function(node) {
        node.save(function (err, node) {
            if (err) {
                console.err('Error saving new node to database:', err);
            } else {
                console.log('Node saved to database with id:', node.id);
            }
            done++;
            if (done === nodes.length) {
                console.log('Done saving nodes');
            }
        });
    };

    for (var n = 0; n < nodes.length; n++) {
        saveNode(nodes[n]);
    }
};

//saveNodes(nodes);
