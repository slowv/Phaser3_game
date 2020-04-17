export const CST = {
  SCENES: {
    LOAD: 'LOAD',
    MENU: 'MENU',
    PLAY: 'PLAY',
    LOGIN: 'LOGIN',
    ROOM_WAIT: 'ROOM_WAIT',
  },
  IMAGE: {
    BTN_PLAY: 'play_button.png',
    BG: 'bg.png'
  },
  TILEMAP: {
    PNG: 'Tileset_Sprite_Sheet.png',
    JSON: 'mappy.json'
  },
  AUDIO: {
    BG_MUSIC: 'Tropical_Moments.mp3'
  },
  SPRITE: {},
  ATLAS: {
    CHARACTER: {
      RIVEN: {
        KEY: 'CUNG_THU',
        PNG: 'character/character.png',
        JSON: 'character/character_atlas.json',
        ANIMATION: 'character/character_anim.json',
        PROPERTY: {
          HP: 400, /* Máu */
          ATTACK: 55, /* Tấn công thường */
          MAGIC: 0, /* Phép thuật */
          ENERGY: 350, /* Năng lượng */
          ARMOR: 25, /* Giáp */
          MAGICAL_RESISTENCE: 30, /* Kháng phép */
          SPEED: 300, /* Tốc độ chạy */
          ATTACK_SPEED: 0.65, /* Tốc độ đánh */
          HEALTH_REGEN: 1.1, /* Tốc độ hồi máu */
          ENERGY_REGEN: 1, /* Tốc độ hồi năng lượng */
          CRITICAL: 0, /* Tỉ lệ chí mạng */
          RELOAD_SKILL: 0, /* Phần trăm hồi chiêu */
          ATTACK_DISTANCE: 550 /* Tầm đánh */
        },
        SKILL: {
          Q: {
            TEXTURE: 'null',
            FRAME: 'null',
            NAME: 'Chú Tâm Tiễn',
            // tslint:disable-next-line:max-line-length
            DESCRIPTION: 'Cung thủ gia tăng điểm Chú Tâm bằng cách tung những phát bắn thường. ' +
              'Khi đạt tối đa điểm Chú Tâm, Chú Tâm Tiễn sẽ tiêu hao hết tất cả điểm này giúp ' +
              'tăng Tốc độ Đánh và khiến các đòn đánh thường của ' +
              'Cung thủ thành những mũi tên liên hoàn trong một thời gian.  ' +
              'Nội tại: Đòn đánh thường tăng điểm Chú Tâm trong 4 giây, cộng dồn tối đa 4 lần. ' +
              'Cộng dồn sẽ giảm dần, và tại 4 điểm, Cung thủ có thể sử dụng tất cả điểm Chú Tâm để kích hoạt Chú Tâm Tiễn. ' +
              'Kích hoạt: Trong 4 giây, Cung thủ nhận được 20/25/30/35/40% Tốc độ Đánh, ' +
              'và đòn đánh thường bắn ra các mũi tên liên hoàn gây sát thương vật lý. ' +
              'Trong thời gian đó, điểm Chú Tâm không cộng dồn. Chú Tâm Tiễn áp dụng Băng Tiễn.',
            TIME_LOAD: 0,
            ENERGY: 50,
            ACTION: (): void => {
              console.log('Sử dụng Chú Tâm Tiễn thành công!');
            },
            DISTANCE: 400,
            IMAGE: {
              TEXTURE: 'null',
              frame: 'null'
            }
          },
          W: {
            TEXTURE: 'null',
            FRAME: 'null',
            NAME: 'Tán Xạ Tiễn',
            DESCRIPTION: 'Cung thủ bắn ra 9 mũi tên theo hình nón gây sát thương, có áp dụng hiệu ứng Băng Tiễn. \n ' +
              'Bắn tên theo hình nón, mỗi mũi tên gây 20/35/50/65/80 (+) Sát thương vật lý. ' +
              'Kẻ địch có thể trúng nhiều mũi tên, nhưng chỉ chịu sát thương từ mũi đầu tiên. \n ' +
              'Những mũi tên trúng vào tướng được tính như đòn chí mạng (tăng tỷ lệ làm chậm của Băng Tiễn).',
            TIME_LOAD: 12,
            ENERGY: 50,
            ACTION: (): void => {
              console.log('Sử dụng Tán Xạ Tiễn thành công!');
            },
            DISTANCE: 1200,
            IMAGE: {
              TEXTURE: 'null',
              frame: 'null'
            }
          },
          E: {
            TEXTURE: 'null',
            FRAME: 'null',
            NAME: 'Ưng Tiễn',
            DESCRIPTION: 'Cung thủ lệnh cho Linh Hồn Chim Ưng đi do thám bất cứ đâu trên bản đồ.\n ' +
              'Soi sáng địa hình trên đường bay đến điểm đã chọn trên bất kì đâu của bản đồ. ' +
              'Khi Linh Hồn Chim Ưng bay đến nơi, nó sẽ giúp soi sáng khu vực đấy trong 5 giây. ' +
              'Cung thủ có thể tích trữ lên đến 2 điểm cộng dồn Ưng Tiễn một lúc.',
            TIME_LOAD: 20,
            ENERGY: 0,
            ACTION: (): void => {
              console.log('Sử dụng Ưng Tiễn thành công!');
            },
            DISTANCE: 25000,
            IMAGE: {
              TEXTURE: 'null',
              frame: 'null'
            },
            STACK: 2
          },
          R: {
            TEXTURE: 'null',
            FRAME: 'null',
            NAME: 'Đại Băng Tiễn',
            DESCRIPTION: 'Cung thủ bắn ra một mũi tên băng theo đường thẳng. ' +
              'Nếu mũi tên trúng một tướng địch, nó sẽ gây sát thương và làm choáng hắn. ' +
              'Thời gian làm choáng tăng theo quãng đường mũi tên bay được. ' +
              'Ngoài ra, kẻ địch xung quanh cũng dính sát thương và bị làm chậm. \n ' +
              'Bắn ra một mũi tên băng giá khổng lồ bay theo đường thẳng công kích và ' +
              'làm choáng tướng địch đầu tiên trúng phải gây 200/400/600 (+) sát thương phép.' +
              ' Mũi tên bay càng xa sẽ làm choáng càng lâu, lên đến tối đa 3.5 giây. ' +
              'Những kẻ địch xung quanh chỉ phải chịu nửa sát thương.',
            TIME_LOAD: 80,
            ENERGY: 100,
            ACTION: (): void => {
              console.log('Sử dụng Đại Băng Tiễn thành công!');
            },
            DISTANCE: 25000,
            IMAGE: {
              TEXTURE: 'null',
              frame: 'null'
            }
          },
          BASE: {
            TEXTURE: 'null',
            FRAME: 'null',
            NAME: '',
            DESCRIPTION: '',
            ACTION: () => {

            }
          }
        },
        AVATAR: 'character/riven/riven.png'
      }
    }
  },
  ANIM: {
    CHARACTER: {
      HURT: 'hurt',
      ATTACK_LEFT: 'attack_left',
      RUN_LEFT: 'run_left',
      RUN_RIGHT: 'run_right',
      RUN_DOWN: 'run_down',
      RUN_UP: 'run_up'
    }
  },
  HUD: {
    BANG_CHI_SO: 'perks/PerksAtlas_31.png', // stat
    TAN_CONG: 'perks/PerksAtlas_39.png', // attack
    PHEP_THUAT: 'perks/PerksAtlas_41.png', // magic
    GIAP: 'perks/PerksAtlas_49.png', // armor
    KHANG_PHEP: 'perks/PerksAtlas_50.png', //
    TOC_DO_DANH: 'perks/PerksAtlas_51.png', //
    HOI_CHIEU: 'perks/PerksAtlas_55.png', //
    TAM_DANH: 'perks/PerksAtlas_60.png', //
    CHI_MANG: 'perks/PerksAtlas_57.png', //
    BANG_ANH_DAI_DIEN_VA_KY_NANG: 'clarity/Clarity_HUDAtlas_63.png',
    BANG_TRANG_BI: 'clarity/Clarity_HUDAtlas_82.png',
    MAP: 'clarity/Clarity_HUDAtlas_03.png',
    SCOREBOARD: 'scoreboard/ScoreboardAtlas_03.png',
    AVATAR_UI: 'clarity/avatarUI.png',
    BG_RL_AVATAR_UI: 'perks/PerksAtlas_28.png'
  }
};
