class Utils{

    static dateFormat(date){

        let day = date.getDate() 
        let month = date.getMonth()+1
        let year = date.getFullYear() 
        let hours = date.getHours()
        let minutes = date.getMinutes()

        //---------------formatando as combinações do dia-----------------------
       //formatando dia, mes e hora 
       if(day < 10 && month < 10 && hours < 10 && minutes < 10){

            return '0'+day+'/'+'0'+month+'/'+year+' '+'0'+hours+':'+'0'+minutes
        }

        //formatando dia, mes e hora 
        if(day < 10 && month < 10 && hours < 10){

            return '0'+day+'/'+'0'+month+'/'+year+' '+'0'+hours+':'+minutes
        }

        //formatando dia e mes
        if(day < 10 && month < 10){

            return '0'+day+'/'+'0'+month+'/'+year+' '+hours+':'+minutes
        }

         //formanto dia 
         if(day < 10){

            return '0'+day+'/'+month+'/'+year+' '+hours+':'+minutes
        }
        //-----------------fim das combinações de dias-------------------------- 

        //---------------formatando as combinações do mes-----------------------

        //formato mês e hora
        if(month < 10 && hours < 10 && minutes < 10){

            return day+'/'+'0'+month+'/'+year+' '+'0'+hours+':'+'0'+minutes
        }

        //formato mês e hora
        if(month < 10 && hours < 10){

            return day+'/'+'0'+month+'/'+year+' '+'0'+hours+':'+minutes
        }

        //formato mês
        if(month < 10){

            return day+'/'+'0'+month+'/'+year+' '+hours+':'+minutes
        }
        //-----------------fim das combinações do mes--------------------------
        
        //-------------formatando das combinações de horas---------------------
        
        //formato hora e minutos
        if(hours < 10 && minutes < 10){

            return day+'/'+month+'/'+year+' '+'0'+hours+':'+'0'+minutes
        }

        //formato hora
        if(hours < 10){

            return day+'/'+month+'/'+year+' '+'0'+hours+':'+minutes
        }

        //-----------------fim das combinações de horas------------------------

        //formato minutos
        if(minutes < 10){

            return day+'/'+month+'/'+year+' '+hours+':'+'0'+minutes
        }
        
        return day+'/'+month+'/'+year+' '+hours+':'+minutes

    }//fim dateFormat


}//fim class Utils