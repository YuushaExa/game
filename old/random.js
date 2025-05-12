        // Auto-advance if specified (no need for setTimeout)
        if (scene.next_scene && this.mainDiv.querySelectorAll('[next_scene]').length === 0) {
            setTimeout(() => {
                this.renderScene(scene.next_scene);
            }, 3000);
        }

