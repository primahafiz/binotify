module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('Song', {
      song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Judul: {
        type: DataTypes.STRING,
        allowNull: false
      },
      penyanyi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'Users',
            key : 'user_id'
        }
      },
      Audio_path: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
  
    Song.associate = function (models) {
    }
  
    return Song
  }