        // Auto-advance if specified (no need for setTimeout)
        if (scene.next_scene && this.mainDiv.querySelectorAll('[next_scene]').length === 0) {
            setTimeout(() => {
                this.renderScene(scene.next_scene);
            }, 3000);
        }

---

          hero: {
    name: {
       str: 15,
        hp: 30
    }
  },
  enemies: {
    poring: {
        str: 5,
        hp: 30,
        drops: [
            { item: "jelly", rate: 0.5 },  // 50% chance to drop jelly
            { gold: [1, 5], rate: 0.8 },   // 80% chance to drop 1-5 gold
            { exp: 10, rate: 1.0 }         // Always gives 10 EXP
        ]
    },
    wolf: {
        str: 12,
        hp: 80,
        drops: [
            { item: "skin", rate: 0.3 },  // 30% chance to drop wolf skin
            { gold: [5, 15], rate: 0.6 },  // 60% chance to drop 5-15 gold
            { exp: 30, rate: 1.0 }         // Always gives 30 EXP
        ]
    }
},
