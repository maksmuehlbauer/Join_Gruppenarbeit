let userDataBase = [
    {
        "id": 1,
        "name": "name",
        "email": "m.muehlbauer@kkkk.de",
        "password": "Test123",
        "tasks": [
            {
                "title": "Titel Muster",
                "descripton": "Hier muss der Text hin",
                "assignto": [],
                "category": "cat",
                "DueDate": "DueDate",
                "prio": "prio",
                "subtask": [],

            }
        ],
        "contacts": [
            {
                "name": "Malte",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Kai",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Stefan",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
        ],
    }
]

let prioButtonsColor = document.querySelectorAll('.prio-container button');

function setPriority(priority){
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].style.backgroundColor = 'white';
        
    }
    if(priority == 'high'){
        userDataBase[0].tasks.prio = 2;
        document.getElementById('highPrioButton').style.backgroundColor = 'rgba(255, 61, 0, 1)';
    }
    else if(priority == 'medium'){
        userDataBase[0].tasks.prio = 2;
        document.getElementById('mediumPrioButton').style.backgroundColor = 'rgba(255, 168, 0, 1)';
    }
    else if(priority == 'low'){
        userDataBase[0].tasks.prio = 2;
        document.getElementById('lowPrioButton').style.backgroundColor = 'rgba(122, 226, 41, 1)';
    }

    
}

