const gameData = {
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
    scenes: {
        start_screen: {
            html: `
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background: linear-gradient(135deg, #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%);
                                color: white;
                                font-family: Arial, sans-serif;
                                text-align: center;
                            }
                            .title {
                                font-size: 3em;
                                margin-bottom: 20px;
                                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                            }
                            .start-btn {
                                padding: 15px 30px;
                                background-color: #ff6b6b;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                font-size: 1.2em;
                                cursor: pointer;
                                transition: all 0.3s;
                            }
                            .start-btn:hover {
                                background-color: #ff8e8e;
                                transform: scale(1.05);
                            }
                        </style>
                        <div>
                            <div class="title">Visual Novel</div>
                            <button class="start-btn" next_scene="block_1">Start Game</button>
                         <button class="start-btn" next_scene="block_2">Start 2</button>
                    <button class="options-btn" next_scene="options">Options</button>
                        </div>
            `,
            next_scene: "block_1"
        },
        block_1: {
            background: {
                type: "image",
                source: "background1.jpg"
            },
        },
        block_2: {
            background: {
                type: "color",
                source: "#f0f0f0"
            },
        html: `<button id="colorButton">Click me to change color</button>`,
    onRender: function() {
        const button = document.getElementById("colorButton");
        const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
        let currentColorIndex = 0;

        button.addEventListener("click", function() {
            currentColorIndex = (currentColorIndex + 1) % colors.length;
            button.style.backgroundColor = colors[currentColorIndex];
            button.style.color = "white";
        });
    },
                      next_scene: "block_1"
        },
      options: {
            html: `
                <style>
                    .options-menu {
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 30px;
                        border-radius: 10px;
                        max-width: 500px;
                        margin: auto;
                    }
                    .back-btn {
                        padding: 10px 20px;
                        background-color: #ff6b6b;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        cursor: pointer;
                    }
                </style>
                <div class="options-menu">
                    <h2>Options</h2>
                    <div id="language-switcher">
                        <button data-lang="en">English</button>
                        <button data-lang="ru">Русский</button>
                    </div>
                    <div>Volume controls would go here</div>
                    <button class="back-btn" next_scene="previous_scene">Back</button>
                </div>
            `
        },
    }
};
