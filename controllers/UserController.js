class UserController{

    constructor(formIdCreate,formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

        //Iniciando o metodo para inserir o formulario
        this.onSubmit()

        //cancelando alterações de usuarios
        this.onEdit()

        //trazendo o que está sessioStage
        this.selectAll()

    }

    //editar dados do usuario
    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', (e) =>{

            this.showPanelCreate()
        })

       this.formUpdateEl.addEventListener('submit',event =>{
           
        event.preventDefault()

           let btn = this.formUpdateEl.querySelector('[type=submit]')

           btn.disabled = true

           let values = this.getValues(this.formUpdateEl)


           let index = this.formUpdateEl.dataset.trIndex

           let tr = this.tableEl.rows[index]

           let userOld = JSON.parse(tr.dataset.user)

           let result = Object.assign({},userOld, values)

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if(!values.photo){
                        result._photo = userOld._photo
                    } else{
                        result._photo = content
                    }

                    let user = new User()

                    user.loadFromJSON(result)

                    user.save()

                    this.getTr(user,tr)

                    this.uptadeCount()

                    btn.disabled = false

                    this.formUpdateEl.reset()

                    this.showPanelCreate()

                },
                (e) => {
                    console.error(e)
                }
            ) 

       })
       
    }




    //metodo do clique 
    onSubmit(){
      
        this.formEl.addEventListener('submit',event => {

            event.preventDefault()

            let btn = this.formEl.querySelector('[type=submit]')

            btn.disabled = true


            let values = this.getValues(this.formEl)

            if(!values) return false

            this.getPhoto().then(
                (content) => {

                    values.photo = content

                    this.addLine(values)

                    values.save()

                    this.formEl.reset()

                    btn.disabled = false

                },
                (e) => {
                    console.error(e)
                }
            ) 
        })
    }


    //criando metodo para encontrar o caminho da foto adicionada
    getPhoto(){

        return new Promise((resolve,reject) => {

            let fileReader = new FileReader()

            let elements = [...this.formEl.elements].filter(item=>{

            if(item.name == 'photo'){
                return item
            }  
            })

            let file = elements[0].files[0]

            fileReader.onload = () =>{
                resolve(fileReader.result)
            }

            fileReader.onerror = (e) =>{
                reject(e)
            }

                        
            (file) ? fileReader.readAsDataURL(file) : resolve('dist/img/user.png')

        })
        
    } 

    //criando o metodo percorrer o formulario e cria um JSON
    getValues(formElement){        
        
        let user = {}

        let isValid = true

        var spread = [...formElement.elements]

        spread.forEach(function (field,index){

            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error')

                isValid = false

            }

            if(field.name == "gender"){

                if(field.checked){
                    user[field.name] = field.value
                }

            }else if(field.name == 'admin'){

                user[field.name] = field.checked
                
            }else{
                user[field.name] = field.value
            }
        })

        if(!isValid){
            return false
        }
    
        return new User(
            user.name, 
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        )   
    }//fechando getValues

    

    selectAll(){
        let users = User.getUsersStorage()        

        users.forEach(dataUser => {

            let user = new User()

            user.loadFromFJSON(dataUser)

            this.addLine(user)
        })
    }


    //adiciona um linha de novo usuario
    addLine(dataUser){

        let tr = this.getTr(dataUser)
    
        this.tableEl.appendChild(tr)

        this.uptadeCount()
    }

    //cria uma tr, uma nova secão de usuario
    getTr(dataUser, tr = null){

        if(tr === null) tr = document.createElement('tr')

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = ` 
          
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Sim': 'Não'}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
           `

           this.addEventsTr(tr)

           return tr
    }
    //Editando ou excluindo um usuario
    addEventsTr(tr){

        tr.querySelector('.btn-delete').addEventListener('click',(e)=>{

            if(confirm('Deseja Realmente EXCLUIR?')){

                let user = new User()

                user.loadFromJSON(JSON.parse(tr.dataset.user))

                user.remove()

                tr.remove()
                this.uptadeCount()

            }
        })

        tr.querySelector('.btn-edit').addEventListener('click',(e)=>{

            let json = JSON.parse(tr.dataset.user)

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex
            
            for(let name in json){

                
                let field = this.formUpdateEl.querySelector('[name='+name.replace('_','')+']')
                
                if(field) {


                    switch(field.type){

                        case 'file':
                            continue
                        break

                        case 'radio':

                            field = this.formUpdateEl.querySelector('[name='+name.replace('_','')+'][value='+json[name]+']')

                            field.checked = true

                            break

                        case 'checkbox':

                            field.checked = json[name]

                            break

                        default:

                            field.value = json[name]

                            break
                    }
                    
                    
                }

            }

            this.formUpdateEl.querySelector('.photo').scr = json._photo

            this.showPanelUpdate()


        })
    }


    //metodo para mostrar painel de cadastro de usuario 
    showPanelCreate(){

        document.querySelector('#box-user-create').style.display = 'block'
        document.querySelector('#form-user-update').style.display = 'none'

    }

    //mudando painel para edição de usuario
    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = 'none'
        document.querySelector('#box-user-update').style.display = 'block'
    }

    uptadeCount(){

        let numberUsers = 0

        let numberAdmin = 0

        let spread = [...this.tableEl.children]
        
        spread.forEach(tr =>{
            numberUsers++

            let user = JSON.parse(tr.dataset.user)

            if(user._admin) numberAdmin++
        })

        document.querySelector('#number-users').innerHTML = numberUsers
        document.querySelector('#number-users-admin').innerHTML = numberAdmin
    }
}