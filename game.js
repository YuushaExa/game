const gameData = {
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
                             <div id="language-switcher">
        <button data-lang="en">English</button>
        <button data-lang="ru">Русский</button>
    </div>
                        </div>
            `,
            next_scene: "block_1"
        },
        block_1: {
            background: {
                type: "image",
                source: "background1.jpg"
            },
            dialogues: [
                {
                    character: "Rei",
                    text: { ru: "Привет", en: "Hello" }
                },
                {
                    character: "klkkl",
                    text: { ru: "Как дела?", en: "How are you?" }
                },
                {
                    text: { ru: "Это повествование.", en: "This is narration." },
                    next_scene: "block_2"
                }
            ]
        },
        block_2: {
            background: {
                type: "color",
                source: "#f0f0f0"
            },
            dialogues: [
                {
                    character: "Rei",
                    text: { ru: "Что дальше?", en: "What's next?" },
                    next_scene: "start_screen"
                }
            ]
        }
    }
};
