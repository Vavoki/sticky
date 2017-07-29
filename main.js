(function() {

    window.SA = {

        addEvent: function(element, evType, fn, useCapture) {
            if (element.addEventListener) {
                element.addEventListener(evType, fn, useCapture);
                return true;
            } else if (element.attachEvent) { //for Internet Explorer, which does not support addEventListenet
                return element.attachEvent('on' + evType, fn);
            } else {
                element['on' + evType] = fn;
            }
        },

        load: function() {

            var notes = document.getElementById("notes");
            var savedNotesContent = localStorage.getItem('notesContent');
            var anchorSelected;
            if (typeof savedNotesContent !== 'undefined') {
                notes.innerHTML = savedNotesContent;
            }

            if (document.getElementsByClassName) {
                anchorSelected = document.getElementsByClassName("add")[0];
            } else {
                anchorSelected = document.getElementsByTagName("a")[0];
            }

            SA.addEvent(anchorSelected, "click", SA.addNote, false);
            SA.moveNotes();
            clearAreaBtn.addEventListener('click', SA.clearArea);
            SA.saveState();
        },

        addNote: function(event) {
            var newNode = document.createElement('div'); //creates new node

            newNode.classList.add('note'); // Set the content of the node
            newNode.setAttribute('contenteditable', '');

            newNode.innerHTML = document.getElementById('contentArea').value; //rewrite our notes
            notes.appendChild(newNode);

            SA.saveState();
            SA.moveNotes();
            return false;
        },

        //Save item into local storage
        saveState: function() {
            var notesContent = notes.innerHTML;
            localStorage.setItem('notesContent', notesContent);
        },

        //Drag and Drop
        moveNotes: function() {
            var noteElements = document.getElementsByClassName('note');

            if (noteElements.length > 0) {

                for (var i in noteElements) {
                    noteElements[i].onmousedown = function(e) { // event which happens when mouse button is pushed
                        this.setAttribute('id', 'active-note');
                        this.style.position = 'absolute';
                        this.style.zIndex = 1000;
                    };
                }
            }

            document.onmousemove = function(e) { // event which happens when mouse pointer is moving
                SA.moveAt(e);
            };

            document.onmouseup = function(e) { // event which happens when mouse pointer is moving
                var activeNote = document.getElementById('active-note');
                if (activeNote) {
                    activeNote.removeAttribute('id');
                }
            };
        },

        getCoords: function(elem) {
            var box = elem.getBoundingClientRect(); //returns the coordinates of selected element
            return {
                top: box.top + pageYOffset, // returns coordinates from top of the page, including the scrolled part
                left: box.left + pageXOffset // returns coordinates from left of the page, including the scrolled part
            };
        },

        moveAt: function(e) {
            var activeNote = document.getElementById('active-note');
            if (activeNote) {
                var coords = SA.getCoords(activeNote);
                var shiftX = e.pageX - coords.left;
                var shiftY = e.pageY - coords.top;

                // TODO: correctly define block coordinates.
                activeNote.style.left = e.pageX - 25 + 'px';
                activeNote.style.top = e.pageY - 25 + 'px';
            }
            return false;
        },

        //Clear Area
        clearArea: function() {
            notes.innerHTML = " ";
            localStorage.removeItem('notesContent');
        }

    };
    SA.addEvent(window, "load", SA.load, false);
})();