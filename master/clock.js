let timerID;
self.addEventListener('message', e => {
    switch (e.data) {
        case 'start':
            if (!timerID) {
                timerID = setInterval(() => {
                    self.postMessage('tick');
                }, 50);
            }
            break;
        case 'stop':
            clearInterval(timerID);
            timerID = null;
            break;
    };
}, false);