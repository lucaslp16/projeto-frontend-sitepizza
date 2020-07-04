let cart =[];
let modalQt= 1;
let modalKey = 0;


const c = (e)=>{
    return document.querySelector(e);
}

const cs = (e)=>{
    return document.querySelectorAll(e);
}



//Listagem das Pizzas
pizzaJson.map((item, index)=>{
    //clona  o item
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    //setando  ID  de cada pizza
    pizzaItem.setAttribute('data-key', index);
    
    //Inserindo  informações dos items
    pizzaItem.querySelector('.pizza-item--img img').src =item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //Evento  de CLick para abrir o  Modal
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        //Obtendo acesso a pizza clicada.
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        //Desativando o selected no tamanho da pizzas
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        //Tamanhos Pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //If realizado para deixar sempre marcado a opção grande como padrão na abertura da popup
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })     

        //Startando a  o valor da quantidade de pizza sempre para 1 quando iniciar a ação.
        c('.pizzaInfo--qt').innerHTML = modalQt;

        
        //Adicionado Efeito de Opacidade e exibição do PizzaWindowArea
        c('.pizzaWindowArea').style.opacity =0;
        c('.pizzaWindowArea').style.display= 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity =1;
        },200);
    })


    // preencher informações em pizzaitem
    c('.pizza-area').append( pizzaItem );
    
});

//Eventos do Modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity =0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display ='none';
    },200);
};

//Fechando os Models atraves dos botões.
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

//Adicionando +Pizzas
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
//Retirando pizzas
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt>1){
    modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//Escolhendo qual tamanho da Pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})    

c('.pizzaInfo--addButton').addEventListener('click',()=>{
    
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
    //Adiciona um  identificador
    let  identifier = pizzaJson[modalKey].id+'@'+size;
    let  key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });
    
    if(key > -1){
        cart[key].qt +=modalQt;
    }else{

        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size:size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

//Iniciar a abertura do card
function updateCart(){

    if (cart.length >0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML =''; 

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return  item.id == cart[i].id;
            })
            let cartItem =  c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch (parseInt(cart[i].size)) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
                
            let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;
            
            

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i  ,1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            
            c('.cart').append(cartItem);
        }

    }else{
        c('aside').classList.remove('show');
    }

}
