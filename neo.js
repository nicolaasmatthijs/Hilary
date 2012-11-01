var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var nodes = [db.createNode({'uid': 'Branden', 'type': 'User'}), 
             db.createNode({'uid': 'OAE Team', 'type': 'Group'}),
             db.createNode({'uid': 'Back-end Team', 'type': 'Group'}),
             db.createNode({'uid': 'UI Team', 'type': 'Group'}),
             db.createNode({'uid': 'Test.pdf', 'type': 'Content'})];

/**
 * Store the nodes
 */
var saveNodes = function(nodes) {
    var done = 0;
    var saveNode = function(node) {
        // Save the node
        node.save(function (err, node) {
            if (err) {
                console.err('Error saving new node to database:', err);
            } else {
                console.log('Node saved to database with id:', node.id);
            }
            // Index the node
            node.index(node.data.type, 'name', node.data.uid, function(err, node) {
                done++;
                if (done === nodes.length) {
                    console.log('Done saving nodes');
                }
            });
        });
    };

    for (var n = 0; n < nodes.length; n++) {
        saveNode(nodes[n]);
    }
};

//saveNodes(nodes);

/**
 * Link the nodes
 */
var linkNodes = function(n1, n2, relationship) {
    // Get first node
    db.getIndexedNode(n1.type, 'name', n1.uid, function(err, node1) {
        if (err) {
            console.log(err);
        }
        db.getIndexedNode(n2.type, 'name', n2.uid, function(err, node2) {
            if (err) {
                console.log(err);
            }
            node1.createRelationshipTo(node2, relationship, {}, function(err, rel) {
                if (err) {
                    console.log(err);
                }
                console.log('Done creating relationship');
            })
        });
    });
};

var createLinks = function() {
    linkNodes({'type': 'User', 'uid': 'Branden'}, {'type': 'Group', 'uid': 'OAE Team'}, 'GROUPMEMBER');
    linkNodes({'type': 'Group', 'uid': 'OAE Team'}, {'type': 'Group', 'uid': 'Back-end Team'}, 'GROUPMEMBER');
    linkNodes({'type': 'Group', 'uid': 'Back-end Team'}, {'type': 'Group', 'uid': 'UI Team'}, 'GROUPMEMBER');
    linkNodes({'type': 'Group', 'uid': 'UI Team'}, {'type': 'Group', 'uid': 'OAE Team'}, 'GROUPMEMBER');
    
    linkNodes({'type': 'Group', 'uid': 'OAE Team'}, {'type': 'Content', 'uid': 'Test.pdf'}, 'CONTENTVIEWER');
    linkNodes({'type': 'Group', 'uid': 'Back-end Team'}, {'type': 'Content', 'uid': 'Test.pdf'}, 'CONTENTMANAGER');
    linkNodes({'type': 'Group', 'uid': 'UI Team'}, {'type': 'Content', 'uid': 'Test.pdf'}, 'CONTENTEDITOR');
};

createLinks();

/**
 * Permission checks
 */

// hasAnyRole

var hasAnyRole = function() {
    var cypher = 'START a=node:User(name="Branden"), b=node:Content(name="Test.pdf") MATCH path = shortestPath(a-[*..5]->b) RETURN path';
    var start = Date.now();
    db.query(cypher, {}, function(err, result) {
        console.log(result);
        var end = Date.now();
        console.log(end - start);
    });
};

//hasAnyRole();

// hasRole

var hasRole = function() {
    var start = Date.now();
    var cypher = 'START a=node:User(name="Branden"), b=node:Content(name="Test.pdf") MATCH path = a-[*0..5]->()-[:CONTENTEDITOR]->b RETURN path';
    db.query(cypher, {}, function(err, result) {
        var end = Date.now();
        console.log(result);
        console.log(end - start);
    });
};

//hasRole();

// getDirectRole

var getDirectRole = function() {
    var start = Date.now();
    var cypher = 'START a=node:User(name="Branden"), b=node:Content(name="Test.pdf") MATCH a-[r]->b RETURN r';
    db.query(cypher, {}, function(err, result) {
        if (result) {
            for (var i = 0; i < result.length; i++) {
                console.log(result[i].r.type);
            }
        } else {
            console.log(null);
        }
    });
};

//getDirectRole();

// getAllRoles

var getAllRoles = function() {
    var cypher = 'START a=node:User(name="Branden"), b=node:Content(name="Test.pdf") MATCH path = a-[r*..10]->b RETURN r, path';
    var start = Date.now();
    db.query(cypher, {}, function(err, result) {
        var roles = [];
        for (var i = 0; i < result.length; i++) {
            var role = result[i].r[result[i].r.length - 1].type;
            if (roles.indexOf(role) === -1) {
                roles.push(role);
            }
        }
        console.log(roles);
        var end = Date.now();
        console.log(end - start);
    });
};

//getAllRoles();

// Get group memberships for user

var getGroupMemberships = function() {
    
};

//getGroupMemberships();

// Get direct members of resource

var getDirectMembers = function() {
    
};

//getDirectMembers();
