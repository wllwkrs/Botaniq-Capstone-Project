const { registerHandler, loginHandler, updateUserHandler, createRekomendasiHandler, getAllRekomendasi, getAllManajemen, editManajemen, createManajemenHandler, getManajemenByUserId, hapusManajemenByAuth, getProfileHandler, getaAllcleaned_plants, getaAllplantsandfamily, getPlantsWithFamilyJoin, logoutHandler, tambahTanaman, getTanamanUser, user_plants, get_user_plants, user_plantsandfamily, get_user_plantsandfamily, get_user_plants_by_id, get_user_plantsandfamily_by_id, archive_user_plant, archive_user_plantsandfamily, unarchive_user_plantandfamily, get_user_plantsandfamily_by_id_archived, get_user_plants_by_id_archived, unarchive_user_plant } = require('./handler');
const path = require('path');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/profile',
    options: {
      auth: 'jwt',
      cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
      handler: getProfileHandler
    }
  },
{
  method: 'PUT',
  path: '/users/{id}',
  handler: updateUserHandler,
  options: {
    auth: 'jwt',
    cors: {
      origin: ['*'],
      additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
    },
    payload: {
      output: 'stream',
      
      parse: true,
      multipart: true,
      
      allow: 'multipart/form-data',
      maxBytes: 10 * 1024 * 1024,
    }
  }
},
  
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: { 
        path: path.join(__dirname, '../uploads'),
        redirectToSlash: true,
        index: false,
      }
    }
  },
  {
    method: 'POST',
    path: '/rekomendasi',
    handler: createRekomendasiHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/rekomendasi',
    handler: getAllRekomendasi,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/manajemen',
    handler: getAllManajemen,
    options: {
      auth: false
    }
  },
  {
    method: 'PUT',
    path: '/manajemen/{id}',
    handler: editManajemen,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/manajemen',
    handler: createManajemenHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/manajemen/user/{userId}',
    handler: getManajemenByUserId,
    options: {
      auth: false
    }
  },
  {
    method: 'DELETE',
    path: '/manajemen/{id}',
    handler: hapusManajemenByAuth,
    options: {
      auth: 'jwt'
    }
  },

  {
    method: 'GET',
    path: '/plants',
    handler: getaAllcleaned_plants,
    options: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
    }
  },

    {
    method: 'GET',
    path: '/plantsandfamily',
    handler: getaAllplantsandfamily,
    options: {
      auth: 'jwt',
      cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
    }
  },

  {
    method: 'GET',
    path: '/plantswithjoinfamily',
    handler: getPlantsWithFamilyJoin,
    options: {
      
      cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
    }
  },
  {
  method: 'POST',
  path: '/logout',
  handler: logoutHandler,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'POST',
  path: '/tanaman',
  handler: tambahTanaman,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'GET',
  path: '/tanaman',
  handler: getTanamanUser,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},

{
  method: 'POST',
  path: '/user_plants',
  handler: user_plants,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},

{
  method: 'PATCH',
  path: '/user_plants/archive/{id}',
  handler: archive_user_plant,
  options: {
     auth: 'jwt',
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'PATCH',
  path: '/user_plants/active/{id}',
  handler: unarchive_user_plant,
  options: {
     auth: 'jwt',
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},

{
  method: 'GET',
  path: '/user_plants/{id}',
  handler: get_user_plants_by_id,
  options: {
    auth: 'jwt',
    cors: {
      origin: ['*'],
      additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
    }
  }
},
{
  method: 'GET',
  path: '/user_plants/archived/{id}',
  handler: get_user_plants_by_id_archived,
  options: {
    auth: 'jwt',
    cors: {
      origin: ['*'],
      additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
    }
  }
},

{
  method: 'GET',
  path: '/user_plants',
  handler: get_user_plants,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},

{
  method: 'POST',
  path: '/user_plantsandfamily',
  handler: user_plantsandfamily,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'PATCH',
  path: '/user_plantsandfamily/archive/{id}',
  handler: archive_user_plantsandfamily,
  options: {
     auth: 'jwt',
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'PATCH',
  path: '/user_plantsandfamily/active/{id}',
  handler: unarchive_user_plantandfamily,
  options: {
     auth: 'jwt',
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},
{
  method: 'GET',
  path: '/user_plantsandfamily',
  handler: get_user_plantsandfamily,
  options: {
    auth: 'jwt', 
     cors: {
        origin: ['*'],
        additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
      },
  }
},


{
  method: 'GET',
  path: '/user_plantsandfamily/{id}',
  handler: get_user_plantsandfamily_by_id,
  options: {
    auth: 'jwt',
    cors: {
      origin: ['*'],
      additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
    }
  }
},
{
  method: 'GET',
  path: '/user_plantsandfamily/archived/{id}',
  handler: get_user_plantsandfamily_by_id_archived,
  options: {
    auth: 'jwt',
    cors: {
      origin: ['*'],
      additionalHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning']
    }
  }
}

];

module.exports = routes;
