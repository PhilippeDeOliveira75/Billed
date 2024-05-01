import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form id="form-new-bill" data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Type de dépense</label>
                    <select class="form-control blue-border" id="expense-type" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input required type="text" id="expense-name" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres"/>
                    <div id="nameErrorMessage" class="error-message"></div>
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input required type="date" id="datepicker" class="form-control blue-border" data-testid="datepicker"/>
                    <div id="dateErrorMessage" class="error-message"></div>
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <input required type="number" id="amount" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                    <div id="amountErrorMessage" class="error-message"></div>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <input type="number" id="vat" class="form-control blue-border" data-testid="vat" placeholder="70" />
                      <div id="vatErrorMessage" class="error-message"></div>
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="white-text">%</label>
                      <input required type="number"id="pct" class="form-control blue-border" data-testid="pct" placeholder="20" />
                      <div id="pctErrorMessage" class="error-message"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea id="commentary" class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Justificatif</label>
                    <input required id="file" type="file" class="form-control blue-border" data-testid="file" />
                    <div id="fileErrorMessage" class="error-message"></div>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill'data-testid="btn-send-bill" class="btn btn-primary">Envoyer</button>
                  <div id="submitErrorMessage" class="error-message">Vous devez remplir tous les champs obligatoires</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}