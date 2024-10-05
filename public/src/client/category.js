'use strict';

define('forum/category', [
    'forum/infinitescroll',
    'share',
    'navigator',
    'topicList',
    'sort',
    'categorySelector',
    'hooks',
    'alerts',
    'api',
], function (infinitescroll, share, navigator, topicList, sort, categorySelector, hooks, alerts, api) {
    const Category = {};
    const userFilter = '';

    $(window).on('action:ajaxify.start', function (ev, data) {
        if (!String(data.url).startsWith('category/')) {
            navigator.disable();
        }
    });

    Category.init = function () {
        const cid = ajaxify.data.cid;

        app.enterRoom('category_' + cid);

        share.addShareHandlers(ajaxify.data.name);

        topicList.init('category', loadTopicsAfter);

        sort.handleSort('categoryTopicSort', 'category/' + ajaxify.data.slug);

        if (!config.usePagination) {
            navigator.init('[component="category/topic"]', ajaxify.data.topic_count, Category.toTop, Category.toBottom);
        } else {
            navigator.disable();
        }

        handleScrollToTopicIndex();

        handleIgnoreWatch(cid);

        handleLoadMoreSubcategories();

        categorySelector.init($('[component="category-selector"]'), {
            privilege: 'find',
            parentCid: ajaxify.data.cid,
            onSelect: function (category) {
                ajaxify.go('/category/' + category.cid);
            },
        });

        addUserFilterInput();

        hooks.fire('action:topics.loaded', { topics: ajaxify.data.topics });
        hooks.fire('action:category.loaded', { cid: ajaxify.data.cid });
    };

    function handleScrollToTopicIndex() {
        let topicIndex = ajaxify.data.topicIndex;
        if (topicIndex && utils.isNumber(topicIndex)) {
            topicIndex = Math.max(0, parseInt(topicIndex, 10));
            if (topicIndex && window.location.search.indexOf('page=') === -1) {
                navigator.scrollToElement($('[component="category/topic"][data-index="' + topicIndex + '"]'], true, 0);
            }
        }
    }

    function handleIgnoreWatch(cid) {
        $('[component="category/watching"], [component="category/tracking"], [component="category/ignoring"], [component="category/notwatching"]').on('click', function () {
            const $this = $(this);
            const state = $this.attr('data-state');

            api.put(`/categories/${cid}/watch`, { state }, (err) => {
                if (err) {
                    return alerts.error(err);
                }

                $('[component="category/watching/menu"]').toggleClass('hidden', state !== 'watching');
                $('[component="category/watching/check"]').toggleClass('fa-check', state === 'watching');

                $('[component="category/tracking/menu"]').toggleClass('hidden', state !== 'tracking');
                $('[component="category/tracking/check"]').toggleClass('fa-check', state === 'tracking');

                $('[component="category/notwatching/menu"]').toggleClass('hidden', state !== 'notwatching');
                $('[component="category/notwatching/check"]').toggleClass('fa-check', state === 'notwatching');

                $('[component="category/ignoring/menu"]').toggleClass('hidden', state !== 'ignoring');
                $('[component="category/ignoring/check"]').toggleClass('fa-check', state === 'ignoring');

                alerts.success('[[category:' + state + '.message]]');
            });
        });
    }

    function handleLoadMoreSubcategories() {
        $('[component="category/load-more-subcategories"]').on('click', async function () {
            const btn = $(this);
            const { categories: data } = await api.get(`/categories/${ajaxify.data.cid}/children?start=${ajaxify.data.nextSubCategoryStart}`);
            btn.toggleClass('hidden', !data.length || data.length < ajaxify.data.subCategoriesPerPage);
            if (!data.length) {
                return;
            }
            app.parseAndTranslate('category', 'children', { children: data }, function (html) {
                html.find('.timeago').timeago();
                $('[component="category/subcategory/container"]').append(html);
                ajaxify.data.nextSubCategoryStart += ajaxify.data.subCategoriesPerPage;
                ajaxify.data.subCategoriesLeft -= data.length;
                btn.toggleClass('hidden', ajaxify.data.subCategoriesLeft <= 0)
                    .translateText('[[category:x-more-categories, ' + ajaxify.data.subCategoriesLeft + ']]');
            });

            return false;
        });
    }

    Category.toTop = function () {
        navigator.scrollTop(0);
    };

    Category.toBottom = async () => {
        const { count } = await api.get(`/categories/${ajaxify.data.category.cid}/count`);
        navigator.scrollBottom(count - 1);
    };

    function addUserFilterInput() {
        if ($('.user-filter-container').length > 0) {
            return; // Don't add it if it's already present
        }

        const filterContainer = $('<div class="user-filter-container mb-3"></div>');
        const filterInput = $('<input type="text" class="form-control" placeholder="Filter by username">');
        filterContainer.append(filterInput);
        $('[component="category"]').prepend(filterContainer);

        let currentFilter = '';
        let debounceTimer;

        filterInput.on('input', function () {
            const userFilter = $(this).val().trim().toLowerCase();
            console.log('Client-side userFilter:', userFilter); // Debug log

            // Debounce the filter application
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (userFilter !== currentFilter) {
                    currentFilter = userFilter;
                    applyFilter(userFilter);
                }
            }, 300); // Wait for 300ms of inactivity before applying the filter
        });

        // Add a clear button
        const clearButton = $('<button class="btn btn-sm btn-outline-secondary ml-2">Clear</button>');
        filterContainer.append(clearButton);

        clearButton.on('click', function () {
            filterInput.val('');
            currentFilter = '';
            applyFilter('');
        });

        // Initialize the filter with the current URL parameter, if any
        const urlParams = new URLSearchParams(window.location.search);
        const initialFilter = urlParams.get('userFilter');
        if (initialFilter) {
            filterInput.val(initialFilter);
            currentFilter = initialFilter.toLowerCase();
            applyFilter(currentFilter);
        }

        function applyFilter(userFilter) {
            const currentUrl = new URL(window.location.href);
            if (userFilter) {
                currentUrl.searchParams.set('userFilter', userFilter);
            } else {
                currentUrl.searchParams.delete('userFilter');
            }

            const newUrl = currentUrl.toString();

            // Update the URL without reloading the page
            window.history.pushState({ userFilter: userFilter }, '', newUrl);

            // Apply client-side filtering
            $('[component="category/topic"]').each(function() {
                const topicUsername = $(this).find('[component="topic/header"] [component="user/link"]').text().toLowerCase();
                if (userFilter === '' || topicUsername.includes(userFilter)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            // Update topic count
            const visibleTopics = $('[component="category/topic"]:visible').length;
            $('[component="category/topic-count"]').text(visibleTopics);
        }
    }

    function loadTopicsAfter(after, direction, callback) {
        callback = callback || function () {};

        hooks.fire('action:topics.loading');
        const params = utils.params();
        params.userFilter = new URLSearchParams(window.location.search).get('userFilter') || ''; // Get userFilter from URL

        // Clear existing topics when filter changes
        if (direction === 'bottom') {
            $('[component="category/topic"]').remove();
        }

        infinitescroll.loadMore(`/categories/${ajaxify.data.cid}/topics`, {
            after: after,
            direction: direction,
            query: params,
            categoryTopicSort: params.sort || config.categoryTopicSort,
        }, function (data, done) {
            hooks.fire('action:topics.loaded', { topics: data.topics });
            callback(data, done);
        });
    }

    return Category;
});
