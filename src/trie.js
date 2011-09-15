Lunr.Trie = (function () {
  var Node = function (key) {
    this.children = []
    this.key = key
    this.value = []
  }

  Node.prototype = {
    childForKey: function (key) {
      var child = Lunr.utils.detect(this.children, function (child) { return child.match(key) })

      if (!child) {
        child = new Node (key)
        this.children.push(child)
      };

      return child
    },

    setValue: function (value) {
      this.value.push(value)
    },

    match: function (key) {
      return key === this.key
    }
  }

  var Trie = function () {
    this.root = new Node ("")
  }

  Trie.prototype = {
    get: function (key) {
      var keys = this.keys(key)
      var self = this

      return keys.reduce(function (res, k) {
        self.getNode(k).value.forEach(function (v) {
          var val = Lunr.utils.copy(v)
          if (key === k) val.exact = true
          res.push(val)
        })
        return res
      }, [])
    },

    getNode: function (key) {
      var recursiveGet = function (node, key) {
        if (!key.length) return node
        return recursiveGet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveGet(this.root, key)
    },

    keys: function (term) {
      var keys = [],
          term = term || ""

      var getKeys = function (node, term) {
        if (node.value.length) keys.push(term)

        node.children.forEach(function (child) {
          getKeys(child, term + child.key)
        })
      }

      getKeys(this.getNode(term), term)
      return keys
    },

    set: function (key, value) {
      var recursiveSet = function (node, key) {
        if (!key.length) return node.setValue(value)
        recursiveSet(node.childForKey(key.charAt(0)), key.slice(1))
      }

      return recursiveSet(this.root, key)
    }
  }

  return Trie
})()