let cart = []
let modalQt = 1
let sizeKey = 0

async function carregarPizzas() {
  try {
    const resposta = await fetch('./pizzas.json')
    const pizzasJson = await resposta.json()

    pizzasJson.map((item, index) => {
      const pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true)

      pizzaItem.querySelector(".pizza-item--img img").src = item.img
      pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
      pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ 80.00`

      const sizeContainer = pizzaItem.querySelector(".pizza-item--sizes");
      sizeContainer.innerHTML = ''

      item.sizes.map((size) => {
        const pizzaItemSizes = document.querySelector(".pizza-item--size-container").cloneNode(true)

        pizzaItemSizes.querySelector(".pizza-item--size").addEventListener('click', (e) => {
          const pizzaAtual = e.currentTarget.closest('.pizza-item')
          const tamanhos = pizzaAtual.querySelectorAll(".pizza-item--size-container")
          tamanhos.forEach((tamanho) => tamanho.classList.remove('selecionado'))
          e.currentTarget.parentElement.classList.add('selecionado')

          const indexAtual = item.sizes.indexOf(size)
          pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price[indexAtual].toFixed(2)}`
        })

        pizzaItemSizes.querySelector(".pizza-item--size").innerHTML = size
        sizeContainer.appendChild(pizzaItemSizes)
      })

      pizzaItem.querySelector(".pizza-item--add").addEventListener('click', (e) => {
        let estaSelecionado = false
        const pizzaAtual = e.currentTarget.closest('.pizza-item')
        const tamanhos = pizzaAtual.querySelectorAll(".pizza-item--size-container")

        tamanhos.forEach((tamanho, index) => {
          if (tamanho.classList.contains('selecionado')) {
            estaSelecionado = true
            sizeKey = index
          }
        })

        if (estaSelecionado) {
          const botaoAtual = e.currentTarget
          botaoAtual.classList.add('confirmado')
          setTimeout(() => botaoAtual.classList.remove('confirmado'), 1000)

          const identificador = item.id + '@' + sizeKey
          const verificar = cart.findIndex((item) => item.identificador === identificador)

          if (verificar > -1) {
            cart[verificar].qtd += modalQt
          } else {
            cart.push({
              identificador,
              id: item.id,
              sizeKey,
              qtd: modalQt
            })
          }

          updateCart(pizzasJson)
        } else {
          window.alert("Selecione um tamanho!")
        }
      })

      document.querySelector(".pizza-area").append(pizzaItem)
    })
  } catch (err) {
    console.log("erro!", err)
  }
}

function updateCart(pizzasJson) {
  document.querySelector(".pizza-cart-area").innerHTML = ''

  let subtotal = 0
  let frete = 0
  let total = 0

  for (let i in cart) {
    let pizzaItem = pizzasJson.find((item) => item.id === cart[i].id)
    let cartItem = document.querySelector(".models .pizza-cart").cloneNode(true)

    let pizzaSizeName
    let pizzaPrice

    switch (cart[i].sizeKey) {
      case 0:
        pizzaSizeName = 'P'
        pizzaPrice = 40
        break
      case 1:
        pizzaSizeName = 'M'
        pizzaPrice = 60
        break
      case 2:
        pizzaSizeName = 'G'
        pizzaPrice = 80
        break
    }

    subtotal += pizzaPrice * cart[i].qtd


    cartItem.querySelector('.pizza-cart--img img').src = pizzaItem.img
    cartItem.querySelector('.pizza-cart--name').innerHTML = pizzaItem.name
    cartItem.querySelector('.pizza-cart--size').innerHTML = pizzaSizeName
    cartItem.querySelector('.pizza-cart--qtd').innerHTML = cart[i].qtd
    cartItem.querySelector('.pizza-cart--price').innerHTML = `R$ ${(pizzaPrice * cart[i].qtd).toFixed(2)}`

    cartItem.querySelector('.pizza-cart--qtdmenos').addEventListener('click', () => {
      if (cart[i].qtd > 1) {
        cart[i].qtd--
      } else {
        cart.splice(i, 1)
      }
      updateCart(pizzasJson)
    })

    cartItem.querySelector('.pizza-cart--qtdmais').addEventListener('click', () => {
      cart[i].qtd++
      updateCart(pizzasJson)
    })

    document.querySelector(".pizza-cart-area").append(cartItem)
  }
  if(cart.length === 0) {
    frete = 0
    document.querySelector(".carrinho").classList.remove("tem-pizza")
  }
  else {
    frete = 5
    document.querySelector(".carrinho").classList.add("tem-pizza")
  } 
  total = subtotal + frete

  document.querySelector('#subtotal-value').innerHTML = `R$ ${subtotal.toFixed(2)}`
  document.querySelector('#frete-value').innerHTML = `R$ ${frete.toFixed(2)}`
  document.querySelector('#total-value').innerHTML = `R$ ${total.toFixed(2)}`
}

carregarPizzas()


function abrirMenu() {
  const carrinho = document.querySelector(".carrinho")
  const fecharMenu = document.querySelector(".close")
  const menu = document.querySelector(".menu")

  carrinho.addEventListener('click', () => {
    menu.classList.add("ativo")
  })
  fecharMenu.addEventListener('click', () => {
    menu.classList.remove("ativo")
  })

}
abrirMenu()



