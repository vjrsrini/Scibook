const bcrypt = require('bcryptjs');

// In-Memory Data Storage
let users = [];
let instruments = [];
let bookings = [];

let isInMemoryMode = false;

function generateId() {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

const memoryDb = {
  setInMemoryMode: (val) => {
    isInMemoryMode = val;
  },
  isInMemoryMode: () => isInMemoryMode,

  // User Operations
  User: {
    findOne: async (query) => {
      if (!query) return null;
      
      // Simple direct email query
      if (typeof query.email === 'string') {
        return users.find(u => (u.email || '').toLowerCase() === query.email.toLowerCase()) || null;
      }

      // Simple direct username query
      if (typeof query.username === 'string') {
        return users.find(u => (u.username || '').toLowerCase() === query.username.toLowerCase()) || null;
      }

      // $or multi-condition query (e.g. email, username, name, email prefix)
      if (query.$or && Array.isArray(query.$or)) {
        for (const condition of query.$or) {
          for (const [key, val] of Object.entries(condition)) {
            let searchStr = '';
            if (val instanceof RegExp) {
              searchStr = val.source.replace(/^\^|\$$|\\/g, '').replace(/@$/, '').toLowerCase();
            } else if (typeof val === 'string') {
              searchStr = val.toLowerCase();
            }

            if (searchStr) {
              const matched = users.find(u => {
                const uEmail = (u.email || '').toLowerCase();
                const uName = (u.name || '').toLowerCase();
                const uUsername = (u.username || uEmail.split('@')[0] || '').toLowerCase();

                return uEmail === searchStr ||
                       uUsername === searchStr ||
                       uName === searchStr ||
                       uEmail.startsWith(searchStr + '@');
              });
              if (matched) return matched;
            }
          }
        }
      }

      return null;
    },
    findById: async (id) => {
      const u = users.find(user => user._id.toString() === id.toString());
      if (!u) return null;
      return {
        ...u,
        select: (fields) => {
          const clone = { ...u };
          if (fields.includes('-password')) delete clone.password;
          return clone;
        },
        save: async () => u
      };
    },
    create: async (data) => {
      const email = data.email || '';
      const newUser = {
        _id: generateId(),
        name: data.name,
        username: data.username || email.split('@')[0] || data.name,
        email: email,
        password: data.password,
        role: data.role || 'student',
        certificationLevel: data.certificationLevel || 'none',
        createdAt: new Date()
      };
      users.push(newUser);
      return newUser;
    },
    find: (query = {}) => {
      return {
        select: (fields) => ({
          sort: () => users.map(u => {
            const copy = { ...u };
            if (fields && fields.includes('-password')) delete copy.password;
            return copy;
          })
        }),
        sort: () => [...users]
      };
    },
    countDocuments: async () => users.length
  },

  // Instrument Operations
  Instrument: {
    find: (query = {}) => {
      let result = [...instruments];
      if (query.category) {
        result = result.filter(i => i.category === query.category);
      }
      if (query.status) {
        result = result.filter(i => i.status === query.status);
      }
      if (query.$or) {
        const searchRegex = query.$or[0]?.name?.$regex;
        if (searchRegex) {
          const term = searchRegex.toLowerCase();
          result = result.filter(i =>
            i.name.toLowerCase().includes(term) ||
            (i.description && i.description.toLowerCase().includes(term)) ||
            (i.location && i.location.toLowerCase().includes(term))
          );
        }
      }
      return {
        sort: () => result
      };
    },
    findById: async (id) => {
      return instruments.find(i => i._id.toString() === id.toString()) || null;
    },
    create: async (data) => {
      const newInst = {
        _id: generateId(),
        name: data.name,
        category: data.category,
        description: data.description || '',
        status: data.status || 'available',
        requiresCertification: data.requiresCertification || 'none',
        location: data.location || '',
        createdAt: new Date()
      };
      instruments.push(newInst);
      return newInst;
    },
    findByIdAndUpdate: async (id, updateData, options) => {
      const inst = instruments.find(i => i._id.toString() === id.toString());
      if (!inst) return null;
      Object.assign(inst, updateData);
      return inst;
    },
    findByIdAndDelete: async (id) => {
      const idx = instruments.findIndex(i => i._id.toString() === id.toString());
      if (idx === -1) return null;
      const removed = instruments.splice(idx, 1)[0];
      return removed;
    }
  },

  // Booking Operations
  Booking: {
    find: (query = {}) => {
      let result = [...bookings];
      if (query.user) {
        result = result.filter(b => b.user._id.toString() === query.user.toString());
      }

      const formatResponse = () => result.map(b => ({
        ...b,
        user: typeof b.user === 'object' ? b.user : users.find(u => u._id.toString() === b.user.toString()) || { _id: b.user, name: 'User', email: '' },
        instrument: typeof b.instrument === 'object' ? b.instrument : instruments.find(i => i._id.toString() === b.instrument.toString()) || { _id: b.instrument, name: 'Instrument' }
      }));

      return {
        populate: (path, fields) => ({
          populate: (path2, fields2) => ({
            sort: () => formatResponse()
          }),
          sort: () => formatResponse()
        }),
        sort: () => formatResponse()
      };
    },
    findOne: async (query) => {
      if (query.instrument && query.$or) {
        const { startTime, endTime } = query.$or[0];
        const requestedStart = new Date(startTime.valueOf ? startTime.valueOf() : startTime);
        const requestedEnd = new Date(endTime.valueOf ? endTime.valueOf() : endTime);

        const conflict = bookings.find(b => {
          if (b.instrument._id.toString() !== query.instrument.toString()) return false;
          if (!['pending', 'approved'].includes(b.status)) return false;

          const bStart = new Date(b.startTime);
          const bEnd = new Date(b.endTime);

          return (bStart < requestedEnd && bEnd > requestedStart);
        });

        return conflict || null;
      }
      return null;
    },
    findById: async (id) => {
      const b = bookings.find(item => item._id.toString() === id.toString());
      if (!b) return null;
      const populatedUser = users.find(u => u._id.toString() === (b.user._id || b.user).toString());
      const populatedInst = instruments.find(i => i._id.toString() === (b.instrument._id || b.instrument).toString());

      return {
        ...b,
        user: populatedUser || b.user,
        instrument: populatedInst || b.instrument,
        save: async () => b,
        populate: function() { return this; }
      };
    },
    create: async (data) => {
      const userObj = users.find(u => u._id.toString() === data.user.toString()) || { _id: data.user, name: 'User' };
      const instObj = instruments.find(i => i._id.toString() === data.instrument.toString()) || { _id: data.instrument, name: 'Instrument' };

      const newBooking = {
        _id: generateId(),
        instrument: instObj,
        user: userObj,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: data.status || 'pending',
        createdAt: new Date()
      };
      bookings.push(newBooking);
      return newBooking;
    },
    findByIdAndUpdate: async (id, updateData) => {
      const b = bookings.find(item => item._id.toString() === id.toString());
      if (!b) return null;
      Object.assign(b, updateData);

      const populatedUser = users.find(u => u._id.toString() === (b.user._id || b.user).toString());
      const populatedInst = instruments.find(i => i._id.toString() === (b.instrument._id || b.instrument).toString());

      return {
        ...b,
        user: populatedUser || b.user,
        instrument: populatedInst || b.instrument,
        populate: function() { return this; }
      };
    }
  }
};

module.exports = memoryDb;
