// 理解度評価（星評価）機能
// レッスンIDは lesson-l0-1.html のようなファイル名から自動抽出

(function() {
    'use strict';

    // レッスンIDを取得（ファイル名から）
    function getLessonId() {
        const path = window.location.pathname;
        const match = path.match(/lesson-(l\d+-\d+)\.html/);
        return match ? match[1] : null;
    }

    // 現在の評価を保持する変数（リアルタイム更新用）
    let currentRating = 0;

    // 星評価UIを初期化
    function initStarRating() {
        const lessonId = getLessonId();
        if (!lessonId) return;

        const container = document.getElementById('star-rating-container');
        if (!container) return;

        // 現在の評価を取得
        currentRating = parseInt(localStorage.getItem(`lesson_rating_${lessonId}`) || '0');

        // 星を生成
        for (let i = 1; i <= 3; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = 'star-btn focus:outline-none transition-all duration-200';
            star.setAttribute('data-rating', i);
            star.innerHTML = '<i class="fas fa-star text-2xl"></i>';
            
            // 既存の評価を反映
            if (i <= currentRating) {
                star.classList.add('text-yellow-400');
            } else {
                star.classList.add('text-slate-300');
            }

            // クリックイベント
            star.addEventListener('click', () => handleStarClick(i, lessonId));
            
            // ホバー効果
            star.addEventListener('mouseenter', () => highlightStars(i));
            star.addEventListener('mouseleave', () => restoreStars());

            container.appendChild(star);
        }

        // 初期状態を反映
        updateCompletionStatus(lessonId, currentRating);
    }

    // 星をクリックした時の処理
    function handleStarClick(rating, lessonId) {
        // 現在の評価を更新
        currentRating = rating;
        
        // ローカルストレージに保存
        localStorage.setItem(`lesson_rating_${lessonId}`, rating.toString());
        
        // UIを更新（即座に反映）
        updateStars(rating);
        
        // 完了状態を更新
        updateCompletionStatus(lessonId, rating);
    }

    // 星の表示を更新
    function updateStars(rating) {
        const stars = document.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
            const starNum = index + 1;
            if (starNum <= rating) {
                star.classList.remove('text-slate-300');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-slate-300');
            }
        });
    }

    // ホバー時に星をハイライト
    function highlightStars(rating) {
        const stars = document.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
            const starNum = index + 1;
            if (starNum <= rating) {
                star.classList.remove('text-slate-300');
                star.classList.add('text-yellow-400', 'scale-110');
            }
        });
    }

    // ホバー解除時に元に戻す（最新の評価を使用）
    function restoreStars() {
        const stars = document.querySelectorAll('.star-btn');
        stars.forEach((star, index) => {
            const starNum = index + 1;
            star.classList.remove('scale-110');
            if (starNum <= currentRating) {
                star.classList.remove('text-slate-300');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-slate-300');
            }
        });
    }

    // 完了状態を更新（3つ全部ライトアップされたら完了とする）
    function updateCompletionStatus(lessonId, rating) {
        if (rating === 3) {
            localStorage.setItem(`lesson_completed_${lessonId}`, 'true');
        } else {
            // 3つ未満の場合は完了状態を解除しない（既存の完了状態を保持）
            // ただし、明示的に未完了にしたい場合は以下のコメントを外す
            // localStorage.setItem(`lesson_completed_${lessonId}`, 'false');
        }
    }

    // DOMContentLoaded時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStarRating);
    } else {
        initStarRating();
    }
})();

