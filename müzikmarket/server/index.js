const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const bodyParser = require('body-parser');
const db = new sqlite3.Database('ecommerce.db');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      price INTEGER NOT NULL,
      category VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      favorited BOOLEAN NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Tablo oluşturma hatası:', err.message);
      } else {
        console.log('Tablo oluşturuldu veya zaten mevcut.');
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      gender VARCHAR(255),
      phone VARCHAR(255),
      birth VARCHAR(255)
    )`,
    (err) => {
      if (err) {
        console.error('Tablo oluşturma hatası:', err.message);
      } else {
        console.log('Tablo oluşturuldu veya zaten mevcut.');
      }
    }
  );
  const products = [
    {
      id: 1,
      name: 'Ürün deneme',
      price: 100,
      category: 'Piyanolar',
      image:
        'https://cangozmuzik.com.tr/uploads/p/p/Nux-WK-400-Dijital-Piyano-Tabureli_1.jpg',
    },
    {
      id: 2,
      name: 'Ürün 2',
      price: 200,
      category: 'Tuşlular',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Ürün 3',
      price: 300,
      category: 'Gitarlar',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'Ürün 4',
      price: 400,
      category: 'Yaylılar',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      name: 'Ürün 5',
      price: 400,
      category: 'Nefesliler',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      name: 'Ürün 6',
      price: 400,
      category: 'Davul',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 7,
      name: 'Ürün 7',
      price: 400,
      category: 'Aksesuar',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const insertProducts = () => {
    const insertStatement = db.prepare(
      `INSERT OR IGNORE INTO products (id, name, price, category, image, favorited)
        VALUES (?, ?, ?, ?, ?, ?)`
    );

    products.forEach((product) => {
      insertStatement.run(
        product.id,
        product.name,
        product.price,
        product.category,
        product.image,
        product.favorited ? 1 : 0
      );
    });

    insertStatement.finalize();
  };

  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
    } else if (row.count === 0) {
      insertProducts();
      console.log('Ürünler veritabanına eklendi.');
    } else {
      console.log('Ürünler zaten veritabanında mevcut.');
    }
  });
});

app.post('/products', (req, res) => {
  const { name, price, category, image, favorited } = req.body;

  db.run(
    `INSERT INTO products (name, price, category, image, favorited)
      VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, favorited ? 1 : 0],
    (err) => {
      if (err) {
        console.error('Ürün ekleme hatası:', err.message);
        res.status(500).json({ error: 'Ürün eklenirken bir hata oluştu' });
      } else {
        res.status(200).json({ message: 'Ürün başarıyla eklendi' });
      }
    }
  );
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Ürün listeleme hatası:', err.message);
      res.status(500).json({ error: 'Ürünler listelenirken bir hata oluştu' });
    } else {
      res.status(200).json(rows);
    }
  });
});


app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Kullanıcı sorgulama hatası:', err.message);
      res
        .status(500)
        .json({ error: 'Kullanıcı sorgulanırken bir hata oluştu' });
    } else if (row) {
      res.status(400).json({ error: 'Bu e-posta zaten kullanılıyor' });
    } else {
      db.run(
        `INSERT INTO users (name,email, password)
          VALUES (?,?, ?)`,
        [name, email, password],
        (err) => {
          if (err) {
            console.error('Kullanıcı ekleme hatası:', err.message);
            res
              .status(500)
              .json({ error: 'Kullanıcı eklenirken bir hata oluştu' });
          } else {
            res.status(200).json({ name, email, password });
          }
        }
      );
    }
  });
});

app.post('/users/profileupdate', (req, res) => {
  const { email, password, name, phone, birth, gender, address } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      console.error('Veritabanı hatası:', err.message);
      res.status(500).json({ error: 'Veritabanı hatası' });
    } else {
      if (row) {
        const userId = row.id;

        if (password) {
          db.run(
            `UPDATE users SET password = ?, name = ?, phone = ?, birth = ?, gender = ?, address = ? WHERE id = ?`,
            [password, name, phone, birth, gender, address, userId],
            (err) => {
              if (err) {
                console.error('Güncelleme hatası:', err.message);
                res.status(500).json({ error: 'Güncelleme hatası' });
              } else {
                console.log('Şifre ve diğer alanlar güncellendi');
                res.status(200).json({ ...row });
              }
            }
          );
        } else {
          db.run(
            `UPDATE users SET name = ?, phone = ?, birth = ?, gender = ?, address = ? WHERE id = ?`,
            [name, phone, birth, gender, address, userId],
            (err) => {
              if (err) {
                console.error('Güncelleme hatası:', err.message);
                res.status(500).json({ error: 'Güncelleme hatası' });
              } else {
                console.log('Diğer alanlar güncellendi');
                res.status(200).json({ ...row });
              }
            }
          );
        }
      } else {
        res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        console.error('Kullanıcı sorgulama hatası:', err.message);
        res
          .status(500)
          .json({ error: 'Kullanıcı sorgulanırken bir hata oluştu' });
      } else if (row) {
        res.status(200).json({ ...row });
      } else {
        res.status(401).json({ error: 'Hatalı e-posta veya şifre' });
      }
    }
  );
});

// app.post('/users/favorites', (req, res) => {
//     const { userId, productId } = req.body;
//
//     db.run(
//         `UPDATE users SET favorites = JSON_ARRAY_INSERT(favorites, '$', ?) WHERE id = ?`,
//         [productId, userId],
//         (err) => {
//             if (err) {
//                 console.error('Favorilere ekleme hatası:', err.message);
//                 res.status(500).json({ error: 'Favorilere ekleme sırasında bir hata oluştu' });
//             } else {
//                 res.status(200).json({ message: 'Ürün favorilere eklendi' });
//             }
//         }
//     );
// });
//
// app.delete('/users/favorites', (req, res) => {
//     const { userId, productId } = req.body;
//
//     db.run(
//         `UPDATE users SET favorites = JSON_REMOVE(favorites, JSON_UNQUOTE(JSON_SEARCH(favorites, 'one', ?))) WHERE id = ?`,
//         [productId, userId],
//         (err) => {
//             if (err) {
//                 console.error('Favorilerden çıkarma hatası:', err.message);
//                 res.status(500).json({ error: 'Favorilerden çıkarma sırasında bir hata oluştu' });
//             } else {
//                 res.status(200).json({ message: 'Ürün favorilerden çıkarıldı' });
//             }
//         }
//     );
// });
//
// app.post('/users/basket', (req, res) => {
//     const { userId, productId } = req.body;
//
//     db.run(
//         `UPDATE users SET basket = JSON_ARRAY_INSERT(basket, '$', ?) WHERE id = ?`,
//         [productId, userId],
//         (err) => {
//             if (err) {
//                 console.error('Sepete ekleme hatası:', err.message);
//                 res.status(500).json({ error: 'Sepete ekleme sırasında bir hata oluştu' });
//             } else {
//                 res.status(200).json({ message: 'Ürün sepete eklendi' });
//             }
//         }
//     );
// });
//
// app.delete('/users/basket', (req, res) => {
//     const { userId, productId } = req.body;
//
//     db.run(
//         `UPDATE users SET basket = JSON_REMOVE(basket, JSON_UNQUOTE(JSON_SEARCH(basket, 'one', ?))) WHERE id = ?`,
//         [productId, userId],
//         (err) => {
//             if (err) {
//                 console.error('Sepetten çıkarma hatası:', err.message);
//                 res.status(500).json({ error: 'Sepetten çıkarma sırasında bir hata oluştu' });
//             } else {
//                 res.status(200).json({ message: 'Ürün sepetten çıkarıldı' });
//             }
//         }
//     );
// });

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
