$(() => {
  window.location.href = "#first";

  /* server request
    ===================== */
  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: (data) => {
      
      let coinsList = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id) {
          coinsList.push(data[i]);
          if (coinsList.length ===100) break;
        }
      }
      $(".card-coins").show();
      // console.log(coinsList)
      loadCoinsToCard(coinsList);
    },
    error: (error)=> {
      alert('Sorry,no connection, try later')
    }
      
  });
//  $('.row-crypto').on("click",'.form-check', function(list){
//   addFavoriteCoins(this.list)
//   })
   
  
  /* show all coins in card
  =============================== */
  const loadCoinsToCard = (coinsList) => {

    let cardsContainerElement = $(".row-crypto");
    let cardElement = " ";

    coinsList.forEach((element) => {
      cardElement = `
            <div class="col-9 col-sm-4 col-lg-3">
            <div class="card border-1 border-primary card-coins">
                <div class="card-body text-center py-1">
                    <h5 class="card-header text-white bg-primary">${element.symbol}</h5><br>
                    <p class="lead card-subtitle">${element.name}</p> <hr>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">
                      </label>
                    </div>
                    <button id=${element.id} class="btn btn-primary btn-moreInfo" 
                        type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${element.id}" 
                        aria-expanded="false" aria-controls="collapseExample">
                        details
                    </button>
                    </p>
                        <div class="collapse" id="collapseExample${element.id}">
                            <div id="${element.id}_moreInfo" class="card card-body card-details">
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
      cardsContainerElement.append(cardElement);
      loadMoreDetails();
    });
  };

  /* server request for details
=================================== */
  const loadMoreDetails = () => {
    $(".row-crypto").on("click", ".btn-moreInfo", function () {
      let id = `${this.id}`;
      return $.ajax(
        {
          url: `https://api.coingecko.com/api/v3/coins/${id}`,
          success: (data) => {
            saveToLocalStorage(data);
          },
          error:()=> {
            alert("Sorry, we have a problem loading this information, try later")
          }
        },

        (saveToLocalStorage = (data) => {
          console.log(data);

          let coinDetailsElement = {
            usd: `${data.market_data.current_price.usd} `,
            eur: `${data.market_data.current_price.eur} `,
            ils: `${data.market_data.current_price.ils} `,
            symbol:`${data.symbol}`,
            img: `${data.image.small}`,
          };

          localStorage.setItem(
            `coinDetailsElement ${data.symbol}`,
            JSON.stringify(coinDetailsElement)
          );
          setTimeout(()=> {
            localStorage.removeItem(`coinDetailsElement ${data.symbol}`)
          }, 120000)

          $(`#${id}_moreInfo`).html(
            `  
                <img src="${coinDetailsElement.img}" width="50" />  <br>
                Current rate is:<br>
                usd: ${coinDetailsElement.usd} $ <br>
                eur: ${coinDetailsElement.eur} € <br>
                ils: ${coinDetailsElement.ils} ₪ <br>
                
            `
          );
        })
      );
    });
  };
  /* search
========================== */
  $("#myInput").on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $(".main-container .card").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

 
});