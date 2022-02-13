# création d'une nouvelle association form
curl -X POST -d '' http://localhost:3000/association-forms/

# validation du service financié
curl -X PUT -d 'associationFormId=2' http://localhost:3000/financial-service/validate

# Validation légal
curl -X PUT -d 'associationFormId=2' http://localhost:3000/legal-service/validate

# création du procès verbal
curl -X POST -d 'idVoters[]=4&idVoters[]=5&content=ProcèsVerbal2&date=0/02/2022'  http://localhost:3000/verbal-processes/


# Création d'une nouvelle association
curl -X POST -d 'name=Assoc25&idUsers[]=4&idUsers[]=5&roles[]=Benevol&roles[]=President&associationFormId=2&verbalProcessId=4'  http://localhost:3000/associations/

# get roles
curl -X GET -d '' http://localhost:3000/roles/
