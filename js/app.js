/* 
    * This functionality stops the code and triggers it immediately
*/

(function () {

    /*
        * Create a list the icone all of your cards
    */
    const listCards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
        "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb",
        "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];


    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
    */



    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    /*
     * set up the event listener for a card. If a card is clicked:
     *  - display the card's symbol (put this functionality in another function that you call from this one)
     *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
     *  - if the list already has another card, check to see if the two cards match
     *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
     *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
     *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
     *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
    */


    let openList = [];
    let matchList = [];
    let counterOfMoves = 0;
    const moveCounterDisplay = document.querySelector('.moves');
    const deckOfCards = document.querySelector('.deck');
    const starsPanel = document.querySelector('.stars');
    const cards = document.querySelectorAll('.deck li');
    const stars = starsPanel.querySelectorAll('li');
    const restartButton = document.querySelector('.restart');
    const restartButtonPopup = document.querySelector('.success .restart')
    let startTime;
    let endTime;
    let timerInterval;
    let timerCounter = 0;
    let timerMin = 0;

    addRandomSymbolToCard(cards);
    leaderBoardInit();

    deckOfCards.addEventListener('click', function (evt) {

        /* This condition check:-
         *  does not user click the deck
         *  does not user click in the same card
         *  does not user click in the symbol
        */

        if (!(evt.target.className === 'deck') && (openList.length <= 2) && !(evt.target.isClicked === 1) && !(evt.target.localName === 'i')) {
            showSymbol(evt);
            addCardToOpenList(evt);
            incrementCounter();

            //timer on the desk

            if (counterOfMoves === 1) {
                timerInterval = setInterval(function () {
                    startTimer();
                }, 1000);
            }
            timeOfGame();
            removeStarFromScorePanel();
        }
    });

    //  Restart button 

    restartButton.addEventListener('click', function () {
        resetGame();
    });

    restartButtonPopup.addEventListener('click', function () {
        document.querySelector('.win-popup').style.display = "none";
        resetGame();
    });

    // Functions in game

    /* 
        * if user clicks in the card 
        * function showSymbol() add to the card property "isClicked"
        * this property is used to check: does user clicks card twice 
    */

    function showSymbol(evt) {
        evt.target.className = 'card open show';
        evt.target.isClicked = 1;

    }

    function addCardToOpenList(evt) {
        openList.push(evt.target.firstElementChild);
        checkTwoCardsMatch(openList);
        checkTwoCardsNotMatch(openList);
    }

    function checkTwoCardsMatch(array) {
        if (array.length === 2 && array[0].className === array[1].className) {
            array[0].parentNode.className = 'card match show';
            array[1].parentNode.className = 'card match show';
            matchList.push(array[0]);
            clearTheOpenList(array);
        }
    }

    function checkTwoCardsNotMatch(array) {
        if (array.length === 2 && array[0].className !== array[1].className) {
            setTimeout(function () {
                array[0].parentNode.className = 'card close';
                array[1].parentNode.className = 'card close';
                array[0].parentNode.isClicked = 0;
                array[1].parentNode.isClicked = 0;
                clearTheOpenList(array);
            }, 800);
        }
    }


    function clearTheOpenList(array) {
        for (let i = 0; i < 2; i++) {
            array.shift();
        }
        return array;
    }

    function addRandomSymbolToCard(array) {
        let shuffleListOfCards = shuffle(listCards);
        for (i = 0; i < array.length; i++) {
            array[i].firstElementChild.className = shuffleListOfCards[i];
        }
    }

    function startTimer() {
        let sec;
        timerCounter++
        sec = timerCounter;
        if (timerCounter === 60) {
            timerMin++;
            sec = 0;
            timerCounter = 0;
        }
        document.querySelector('.timer').innerHTML = addZeroToTimer(timerMin) + ':' + addZeroToTimer(sec);
    }

    function addZeroToTimer(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }

    }

    /*
     * Score panel
    */

    function removeStarFromScorePanel() {
        if (counterOfMoves === 30) {
            starsPanel.lastElementChild.style.visibility = 'hidden';
        } else if (counterOfMoves === 50) {
            starsPanel.lastElementChild.previousElementSibling.style.visibility = 'hidden';
        }
    }

    function resetGame() {
        for (let card of cards) {
            card.className = "card close";
            card.isClicked = 0;
        }
        for (star of stars) {
            star.style.visibility = 'visible';
        }
        stopTimer();
        counterOfMoves = 0;
        moveCounterDisplay.innerHTML = counterOfMoves;
        matchList = [];
        openList = [];
        addRandomSymbolToCard(cards);
        document.querySelector('.win-popup').style.display = "none";
        document.querySelector('.win-popup-bg').style.display = "none";
    }
    function getCounterOfMoves() {
        let counterOfMoves = 0;
        return counterOfMoves;
    }

    function incrementCounter() {
        counterOfMoves++;
        moveCounterDisplay.innerHTML = counterOfMoves;
    }

    /*
     * Leader Board Storage
    */

    /* 
     * this section creates a new localstore file and put to it empty array,
     * check browser - if is Edge new localstorage is not create.
     * Edge browser -  throw exception: "SCRIPT16389: Unspecified error"
     * Array is sorted from the best score to the worst store
     * Result is put to the array.
    */


    function leaderBoardInit() {
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        let isEdge = !isIE && !!window.StyleMedia;
        if (!isEdge && !localStorage.leaderBoard) {
            localStorage.leaderBoard = JSON.stringify([]);
        }
    }

    function sortObjectInArray(property) {
        return (a, b) => (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
    }

    function getLeaderBoard() {
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        let isEdge = !isIE && !!window.StyleMedia;
        if (!isEdge) {
            let array = JSON.parse(localStorage.leaderBoard);
            array.sort(sortObjectInArray("score"));
            return array;
        }
    }

    function addScoreToLeaderBoard(obj) {
        let isIE = /*@cc_on!@*/false || !!document.documentMode;
        let isEdge = !isIE && !!window.StyleMedia;
        if (!isEdge) {
            let data = JSON.parse(localStorage.leaderBoard);
            data.push(obj);
            localStorage.leaderBoard = JSON.stringify(data);

        }
    }

    /*
     * Render success msge
    */

    //if element is to be vertical countH have to bigger than countW 

    function changeSizeOfElement(element, widthElement = 400, countH = 10, countW = 20, display) {
        let countHeight = 0;
        let countWidth = 0;
        let id = setInterval(function () {
            countHeight += countH;
            countWidth += countW;
            element.style.display = display;
            element.style.height = countHeight + 'px';
            element.style.width = countWidth + 'px';
            element.style.opacity = widthElement / (widthElement * 3 - widthElement * 2);
            if (countHeight >= widthElement) {
                clearInterval(id)
            }
        }, 5);

    }
    // opacity range (0 - 1)

    function increaseOfOpacity(element, opacity) {
        let countOpacity = 0;
        element.style.opacity = 0;
        element.style.display = 'inherit';
        let id = setInterval(function () {
            countOpacity += 0.02;
            element.style.opacity = countOpacity;
            if (countOpacity >= opacity) {
                clearInterval(id);
            }
        }, 10);
    }

    function openPopup() {
        let heightElement = 400;
        if (window.innerWidth < 900) {
            heightElement = 305;
        }
        if (window.innerWidth <= 600) {
            heightElement = 250;
        }
        if (window.innerWidth <= 450) {
            heightElement = 160;
        }

        increaseOfOpacity(document.querySelector('.win-popup-bg'), 0.7);

        changeSizeOfElement(document.querySelector('.win-popup'), heightElement, 10, 20, 'inherit');

        document.querySelector('#score-time').innerHTML = (Math.round(endTime / 1000, 2) + ' sec');

        document.querySelector('#score-moves').innerHTML = (counterOfMoves + ' moves');

        if (counterOfMoves <= 29) {
            document.querySelector('#score-stars').innerHTML =
                `<img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">`;
        } else if (counterOfMoves <= 49) {
            document.querySelector('#score-stars').innerHTML =
                `<img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">`;
        } else {
            document.querySelector('#score-stars').innerHTML =
                `<img src="img/star.png" alt="star">`
        }

        setTimeout(function () {
            document.querySelector('table').style.display = 'inline-table';
        }, 500)
    }

    /*
     * End Game
    */

    function timeOfGame() {

        // Start game

        if (counterOfMoves === 1) {
            startTime = Date.now();
        }

        // End game

        if (matchList.length === 8) {
            endTime = Date.now() - startTime;
            openPopup();
            stopTimer();
        }

    }

    function getScore() {
        let score = (100 - Math.floor(endTime / 1000)) + (100 - counterOfMoves);
        return score;
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerCounter = 0;
        timerMin = 0;
        document.querySelector('.timer').innerHTML = '00:00';
    }

})();