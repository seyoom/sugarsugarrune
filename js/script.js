$(document).ready(function () {
  let heartsUsed = false;
  let moving = false;

  // 하트가 모일 위치
  let chocolatX = 21.5;
  let chocolatY = 86;
  let vanillaX = 88;
  let vanillaY = 91;

  // 요술봉 커서
  $(document).mousemove(function (e) {
    $(".mouse-wand").css({
      left: e.clientX + "px",
      top: e.clientY + "px",
    });
  });

  // 기본 문구
  function changeText() {
    if ($(".chocolat").hasClass("active") || $(".vanilla").hasClass("active")) {
      $(".poster").addClass("has-selection");
    } else {
      $(".poster").removeClass("has-selection");
    }
  }

  // 하트 모으기
  function collectHearts(x, y, info) {
    let targetX = ($(".poster").width() * x) / 100;
    let targetY = ($(".poster").height() * y) / 100;

    $(".heart").each(function () {
      let heart = $(this);

      heart.find("img").css("animation-play-state", "paused");
      heart.addClass("gathering");

      heart.animate(
        {
          left: targetX - heart.width() / 2,
          top: targetY - heart.height() / 2,
          opacity: 0,
        },
        1900,
      );
    });

    setTimeout(function () {
      $(info).addClass("show");
      moving = false;
    }, 2150);
  }

  // 캐릭터 클릭
  function changeCharacter(name, x, y) {
    if (moving) return;

    let character = $("." + name);
    let info = $("." + name + "-info");
    let witch = character.find(".witch")[0];

    if (!witch || !witch.complete || witch.naturalWidth === 0) {
      console.log("마법사 이미지 파일을 확인해 주세요.");
      return;
    }

    character.toggleClass("active");
    changeText();

    // 다시 교복으로 돌아갈 때
    if (!character.hasClass("active")) {
      info.removeClass("show");
      return;
    }

    info.removeClass("show");

    // 처음 선택한 캐릭터만 하트를 모음
    if (!heartsUsed) {
      heartsUsed = true;
      moving = true;

      setTimeout(function () {
        collectHearts(x, y, info);
      }, 1450);
    } else {
      // 하트가 없으면 변신 후 소개만 표시
      setTimeout(function () {
        if (character.hasClass("active")) {
          info.addClass("show");
        }
      }, 900);
    }
  }

  $(".chocolat").click(function () {
    changeCharacter("chocolat", chocolatX, chocolatY);
  });

  $(".vanilla").click(function () {
    changeCharacter("vanilla", vanillaX, vanillaY);
  });

  // 로고 클릭 시 초기화
  $(".logo").click(function () {
    if (moving) return;

    $(".chocolat, .vanilla").removeClass("active");
    $(".character-info").removeClass("show");
    changeText();

    heartsUsed = false;
    moving = true;

    $(".heart")
      .stop(true, false)
      .each(function () {
        let heart = $(this);

        heart.css({
          transition: "none",
          left: "",
          top: "",
          opacity: 0,
          transform: "scale(0.5)",
        });

        heart.removeClass("gathering");
        heart.find("img").css("animation-play-state", "running");
      });

    setTimeout(function () {
      $(".heart").css({
        transition: "transform 1.2s ease",
        transform: "scale(1)",
      });

      $(".heart").animate({ opacity: 0.9 }, 1200, function () {
        moving = false;
      });
    }, 30);
  });

  changeText();
});
