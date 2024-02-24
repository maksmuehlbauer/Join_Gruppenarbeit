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
			]
		"contacts": [
				{
						"name": "Malte",
						"email": "m.malte@web.de",
						"phone": "+49 172 334 556 87"
				},
			],
		}
]







function addContact() {
	contact = {
				"name": "Hicky",
				"email": "h.hicky@web.de",
				"phone": "+49 0321 111 222 45"
	}
	
	userDataBase[id]['contacts'].push(contact)
}

















function getData() {
	console.log(datenbank[0])

}

function addUser() {
	user = {
		"id": 2,
		"email": "k.karsten@web.de",
		"password": "Test123",
		"tasks": [],
		"contacts": [],
	}
	
	datenbank.push(user)
	
}



function addContact() {
	contact = {
				"name": "Hicky",
				"email": "h.hicky@web.de",
				"phone": "+49 0321 111 222 45"
	}
	
	datenbank[0]['contacts'].push(contact)
}

function addTask() {
	task = {
				"task": "Datenbank anlegen",
				"content": "JSON konfigurieren und Funtkion anlegen",
	}
	
	datenbank[0]['tasks'].push(task)
}


 function render() {
	let content = document.getElementById('content');
		
		for (let i = 0; i < datenbank[0]['contacts'].length; i++) {
			const contact = datenbank[0]['contacts'][i]
		
				content.innerHTML += `
					name: ${contact['name']}<br>
					email: ${contact['email']}<br>
					Tel: ${contact['phone']}<br>
					
				`;
		}


	
 }











