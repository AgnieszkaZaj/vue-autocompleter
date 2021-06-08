Vue.component("v-autocompleter", {
    template:`<div>
    <input type="szukaj" maxlength="2048" title="Szukaj" v-on:click="set()" @keyup.up="next(activeResult - 1)" @keyup.down="next(activeResult + 1)" @keyup.enter="change(value)" :value="value"
    @input="$emit('input', $event.target.value)"> 
    <div class="top10">
        <div id="autocomp" :class="[ value.length != 0 && filteredCities.length != 0 && kontrol == 1 ? 'autocompleter' : 'nic']">
            <ul class="combo_Box">
                <li class="combo_wynik" v-for="(city, index) in filteredCities" @click="change(city.name)" :class="{active : autocompIsActive && activeResult === index}">
                    <img class="combo_lupa" src="loop2.png">
                    <div class="combo_pogrub" v-html="city.nameHtml">
                    </div>  
                </li>
            </ul>
        </div>
    </div>
</div>`,
     data: function (){
            return{
            isActive: 0,
            kontrol: 0,
            autocompIsActive: false,
            activeResult: 0,
            filteredCities: [],
            cities: window.cities.map((cityData) => {
            cityData.nameLowerCase = cityData.name.toLowerCase();
            return cityData;
            })
        }
    },

    watch: 
    {
    value() {
        if (this.autocompIsActive) {
            return;
        }
        if (this.value.length === 0) {
            filteredCities = [];
            return;
        }
        let returnedCities = [];
        let searchLowerCase = this.value.toLowerCase();

        this.cities.forEach((cityData) => {
            if (returnedCities.length === 10 || !cityData.nameLowerCase.includes(searchLowerCase)) {
                return;
            }
            returnedCities.push({
                name: cityData.name,
                nameHtml: cityData.nameLowerCase.replace(searchLowerCase, (match) => {
                    return '<span class="bold">' + match + '</span>';
                })
            })
        });
        
        this.filteredCities = returnedCities;
    }
    },
    methods:
    { 
        set: function()
        {
            this.kontrol = 1;
            this.autocompIsActive = false;
        },
        change: function(x)
        {
            if(this.isActive == 0)
            {
            this.isActive = 1;
            this.$emit('enter', this.isActive, x);
            document.activeElement.blur();
            this.kontrol = 0;
            }
        },
    
        next: function(index)
        {
            if (!this.autocompIsActive) {
            index = 0;
            } 

            if (index > this.filteredCities.length - 1) {
                index = 0;
            } else if (index < 0) {
                index = this.filteredCities.length - 1;
            }
            
            this.autocompIsActive = true;
            this.activeResult = index;
            this.value = this.filteredCities[index].name;
        }
    },
    props: {
        value: {
          type: String,
          default: ""
        },
        options: {
          type: Array,
          default: []
        }
      }, 

})