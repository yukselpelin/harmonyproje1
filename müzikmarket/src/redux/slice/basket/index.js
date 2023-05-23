import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// create async thunk 'ın görevi redux ile async işlemler yapmamıza imkan vermesidir.
// 2 paramtetre alır 1'i ismini temsil eder, 2. si ise bir callback function alır
// genellikle fetch işlemleri için kullanılır.
// callback function'ın içine istediğimiz bir parametre yi yazabiliriz.
// id ye göre sıralayacak olsaydık ve backend de de bunun için bir endpoint olsaydı
// şöyle bir örnek yapılabilirdi

// export const createProductAsyncThunk = createAsyncThunk(
//   'products',
//   async (parametre) => {
//     const response = await fetch(`http://localhost:8080/products/${parametre}`);
//     console.log(response);
//     return response.json();
//   }
// );

//örnekte de görüldüğü üzere paramtereyi alıp ona göre fetch işlemi yapılabiliyor.

//kullanımı da şu şekilde olurdu dispatch(createProductAsyncThunk(parametre))

export const createProductAsyncThunk = createAsyncThunk(
  'products',
  async () => {
    const response = await fetch('http://localhost:8080/products');
    return response.json();
  }
);

let product, item, user;
//bu if yapısının amacı next.js server side bir framework olmasından kaynaklı ve localstorage ise
//client tarafında olan birşey olmasından dolayı client tarafından localstorage e erişip alıyoruz bilgileri
//window client side'a aittir.
if (typeof window !== 'undefined') {
  product = JSON.parse(localStorage.getItem('products'));
  item = JSON.parse(localStorage.getItem('basket'));
  user = JSON.parse(localStorage.getItem('user'));
}

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    products: product || [],
    items: item || [],
    user: user || null,
  },
  reducers: {
    addToBasket:(state,action)=>{
      //state.items değiştirilemez bir obje olduğundan bir clone unu oluşturuyoruz
      let clone = [...state.items];
      //gelen öğenin index değerini alıyoruz
      const findex = state.items.findIndex(
        (item) => item.id == action.payload.id
      );
      if (findex != -1) {
        //gelen öğenin index değeri bulunuyorsa daha doğrusu gelen öğe varsa total değerini 1 arttırıyoruz ki
        //tekrar tekrar aynı üründen eklemeyelim
        clone[findex].total = clone[findex].total + 1;
        //son olarak da state i clone a eşitliyoruz
        if (typeof window !== 'undefined') {
          localStorage.setItem('basket', JSON.stringify(clone));
        }
        state.items = clone;
      } else {
        //gelen öğe state de bulunmuyorsa pushlayıp state e eşitliyoruz
        clone.push({ ...action.payload, total: 1 });
        if (typeof window !== 'undefined') {
          localStorage.setItem('basket', JSON.stringify(clone));
        }
        state.items = clone;
      }
    },
    removeFromBasket: (state, action) => {
      let clone = [...state.items];
      const findex = clone.findIndex((item) => item.id == action.id);
      clone.splice(findex, 1);
      state.items = clone;
      if (typeof window !== 'undefined') {
        localStorage.setItem('basket', JSON.stringify(clone));
      }
    },
    handleFavorites: (state, action) => {
      let clone = [...state.products];
      const findex = clone.findIndex((item) => item.id == action.payload);
      //gelen öğenin index değerini bulup favorited in tam tersi değerini veriyoruz true ise false false ise true
      clone[findex].favorited = !clone[findex].favorited;
      //son olarak da clone u localstorage a atıp state i clone a eşitliyoruz
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(clone));
      }
      state.products = clone;
    },
    handleBasketTotal: (state, action) => {
      let clone = [...state.items];
      const findex = clone.findIndex((item) => item.id == action.payload.id);
      if (action.payload.type == 'UP') {
        // action.payload {id,type} olarak geliyor bizde bu bilgileri kullanarak koşullandırma yapıyoruz
        clone[findex].total = clone[findex].total + 1;
        //koşullandırma up ise total i 1 arttırıyor
        if (typeof window !== 'undefined') {
          localStorage.setItem('basket', JSON.stringify(clone));
        }
        state.items = clone;
      } else {
        // Koşullandırma up değilse 1 azaltıyoruz ama bilgi eski olduğu için 1 fazlası kalıyor bu yüzden 1 e eşit veya
        // küçük ise ürünü tamamen siliyoruz
        if (clone[findex].total <= 1) {
          clone.splice(findex, 1);
          state.items = clone;
          if (typeof window !== 'undefined') {
            item = localStorage.setItem('basket', JSON.stringify(clone));
          }
        } else {
          // eğer ürün 1 e eşit veya 1 den küçük değilse de total değerini 1 düşürüyoruz.
          clone[findex].total = clone[findex].total - 1;
          if (typeof window !== 'undefined') {
            item = localStorage.setItem('basket', JSON.stringify(clone));
          }
          state.items = clone;
        }
      }
    },
    handleDetail: (state, action) => {
      //state.items değiştirilemez bir obje olduğundan bir clone unu oluşturuyoruz
      let clone = [...state.items];
      //gelen öğenin index değerini alıyoruz
      const findex = state.items.findIndex(
        (item) => item.id == action.payload.id
      );
      if (findex != -1) {
        //tekrar tekrar aynı üründen eklemeyelim
        clone[findex].total = clone[findex].total + action.payload.total;
        //son olarak da state i clone a eşitliyoruz
        if (typeof window !== 'undefined') {
          localStorage.setItem('basket', JSON.stringify(clone));
        }
        state.items = clone;
      } else {
        //gelen öğe state de bulunmuyorsa pushlayıp state e eşitliyoruz
        clone.push({ ...action.payload, total: action.payload.total });
        if (typeof window !== 'undefined') {
          localStorage.setItem('basket', JSON.stringify(clone));
        }
        state.items = clone;
      }
    },
    handleUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    handleSignOut: (state) => {
      console.log(state.user);
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProductAsyncThunk.fulfilled, (state, action) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(action.payload));
        state.products = action.payload;
      }
    });
  },
});

export const {
  addToBasket,
  removeFromBasket,
  handleFavorites,
  handleBasketTotal,
  handleDetail,
  handleUser,
  handleSignOut,
} = basketSlice.actions;

export default basketSlice.reducer;
