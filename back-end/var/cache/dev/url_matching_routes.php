<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/doc.json' => [[['_route' => 'app.swagger', '_controller' => 'nelmio_api_doc.controller.swagger'], null, ['GET' => 0], null, false, false, null]],
        '/api/doc' => [[['_route' => 'app.swagger_ui', '_controller' => 'nelmio_api_doc.controller.swagger_ui'], null, ['GET' => 0], null, false, false, null]],
        '/api/login' => [[['_route' => 'api_login'], null, ['POST' => 0], null, false, false, null]],
        '/api/articles' => [
            [['_route' => 'api_articles_list', '_controller' => 'App\\Controller\\ArticleController::list'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_articles_create', '_controller' => 'App\\Controller\\ArticleController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/auth/register' => [[['_route' => 'api_auth_register', '_controller' => 'App\\Controller\\AuthController::register'], null, ['POST' => 0], null, false, false, null]],
        '/api/auth/me' => [[['_route' => 'api_auth_me', '_controller' => 'App\\Controller\\AuthController::me'], null, ['GET' => 0], null, false, false, null]],
        '/api/auth/check' => [[['_route' => 'api_auth_check', '_controller' => 'App\\Controller\\AuthController::check'], null, ['GET' => 0], null, false, false, null]],
        '/api/blocks' => [[['_route' => 'api_blocks_create', '_controller' => 'App\\Controller\\BlockController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/comments' => [[['_route' => 'api_comments_create', '_controller' => 'App\\Controller\\CommentController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/datasets' => [[['_route' => 'api_datasets_list', '_controller' => 'App\\Controller\\DatasetController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/datasets/import/google-sheets' => [[['_route' => 'api_datasets_import_google_sheets', '_controller' => 'App\\Controller\\DatasetController::importFromGoogleSheets'], null, ['POST' => 0], null, false, false, null]],
        '/api/google-sheets/info' => [[['_route' => 'api_google_sheets_info', '_controller' => 'App\\Controller\\GoogleSheetsController::getInfo'], null, ['POST' => 0], null, false, false, null]],
        '/api/google-sheets/data' => [[['_route' => 'api_google_sheets_data', '_controller' => 'App\\Controller\\GoogleSheetsController::getData'], null, ['POST' => 0], null, false, false, null]],
        '/api/google-sheets/all' => [[['_route' => 'api_google_sheets_all', '_controller' => 'App\\Controller\\GoogleSheetsController::getAllSheets'], null, ['POST' => 0], null, false, false, null]],
        '/api/google-sheets/import' => [[['_route' => 'api_google_sheets_import', '_controller' => 'App\\Controller\\GoogleSheetsController::importAsDataset'], null, ['POST' => 0], null, false, false, null]],
        '/api/google-sheets/quick-import' => [[['_route' => 'api_google_sheets_quick_import', '_controller' => 'App\\Controller\\GoogleSheetsController::quickImport'], null, ['POST' => 0], null, false, false, null]],
        '/api/media' => [[['_route' => 'api_media_list', '_controller' => 'App\\Controller\\MediaController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/cod/players' => [[['_route' => 'api_cod_players', '_controller' => 'App\\Controller\\PlayerController::getCodPlayers'], null, ['GET' => 0], null, false, false, null]],
        '/api/valo/players' => [[['_route' => 'api_valo_players', '_controller' => 'App\\Controller\\PlayerController::getValoPlayers'], null, ['GET' => 0], null, false, false, null]],
        '/api/cs2/players' => [[['_route' => 'api_cs2_players', '_controller' => 'App\\Controller\\PlayerController::getCs2Players'], null, ['GET' => 0], null, false, false, null]],
        '/api/ratings/user/me' => [[['_route' => 'api_ratings_my_ratings', '_controller' => 'App\\Controller\\RatingController::myRatings'], null, ['GET' => 0], null, false, false, null]],
        '/api/themes' => [
            [['_route' => 'api_themes_list', '_controller' => 'App\\Controller\\ThemeController::list'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_themes_create', '_controller' => 'App\\Controller\\ThemeController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/users' => [[['_route' => 'api_users_list', '_controller' => 'App\\Controller\\UserController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/visualizations' => [
            [['_route' => 'api_visualizations_list', '_controller' => 'App\\Controller\\VisualizationController::list'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_visualizations_create', '_controller' => 'App\\Controller\\VisualizationController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/welcome' => [
            [['_route' => 'api_welcome_get', '_controller' => 'App\\Controller\\WelcomeController::get'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_welcome_update', '_controller' => 'App\\Controller\\WelcomeController::update'], null, ['PUT' => 0, 'PATCH' => 1], null, false, false, null],
        ],
        '/api/welcome/preview' => [[['_route' => 'api_welcome_preview', '_controller' => 'App\\Controller\\WelcomeController::preview'], null, ['POST' => 0], null, false, false, null]],
        '/api/welcome/templates' => [[['_route' => 'api_welcome_templates', '_controller' => 'App\\Controller\\WelcomeController::templates'], null, ['GET' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
                .'|/api/(?'
                    .'|articles/(?'
                        .'|([^/]++)(?'
                            .'|(*:73)'
                            .'|/publish(*:88)'
                        .')'
                        .'|stats(*:101)'
                    .')'
                    .'|blocks/(?'
                        .'|article/([^/]++)(*:136)'
                        .'|([^/]++)(?'
                            .'|(*:155)'
                        .')'
                        .'|reorder(*:171)'
                    .')'
                    .'|comments/(?'
                        .'|article/([^/]++)(*:208)'
                        .'|([^/]++)(?'
                            .'|(*:227)'
                        .')'
                    .')'
                    .'|datasets/(?'
                        .'|([^/]++)(?'
                            .'|(*:260)'
                            .'|/variables(*:278)'
                        .')'
                        .'|upload(*:293)'
                        .'|([^/]++)(?'
                            .'|/validate(*:321)'
                            .'|(*:329)'
                        .')'
                    .')'
                    .'|google\\-sheets/(?'
                        .'|players/([^/]++)(*:373)'
                        .'|matches/([^/]++)(*:397)'
                        .'|import\\-replace/([^/]++)(*:429)'
                    .')'
                    .'|media/(?'
                        .'|([^/]++)(*:455)'
                        .'|upload(*:469)'
                        .'|([^/]++)(?'
                            .'|(*:488)'
                        .')'
                    .')'
                    .'|ratings/(?'
                        .'|article/([^/]++)(?'
                            .'|(*:528)'
                        .')'
                        .'|block/([^/]++)(?'
                            .'|(*:554)'
                        .')'
                        .'|([^/]++)(*:571)'
                    .')'
                    .'|themes/(?'
                        .'|([^/]++)(?'
                            .'|(*:601)'
                            .'|/(?'
                                .'|activate(*:621)'
                                .'|set\\-default(*:641)'
                            .')'
                        .')'
                        .'|default(?:/([^/]++))?(*:672)'
                    .')'
                    .'|users/(?'
                        .'|([^/]++)(*:698)'
                        .'|register(*:714)'
                        .'|me(*:724)'
                        .'|([^/]++)(?'
                            .'|/(?'
                                .'|roles(*:752)'
                                .'|subscription(*:772)'
                            .')'
                            .'|(*:781)'
                        .')'
                    .')'
                    .'|visualizations/(?'
                        .'|([^/]++)(?'
                            .'|(*:820)'
                        .')'
                        .'|types(*:834)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        73 => [
            [['_route' => 'api_articles_show', '_controller' => 'App\\Controller\\ArticleController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_articles_update', '_controller' => 'App\\Controller\\ArticleController::update'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, true, null],
            [['_route' => 'api_articles_delete', '_controller' => 'App\\Controller\\ArticleController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        88 => [[['_route' => 'api_articles_publish', '_controller' => 'App\\Controller\\ArticleController::publish'], ['id'], ['POST' => 0], null, false, false, null]],
        101 => [[['_route' => 'api_articles_stats', '_controller' => 'App\\Controller\\ArticleController::stats'], [], ['GET' => 0], null, false, false, null]],
        136 => [[['_route' => 'api_blocks_list_by_article', '_controller' => 'App\\Controller\\BlockController::listByArticle'], ['articleId'], ['GET' => 0], null, false, true, null]],
        155 => [
            [['_route' => 'api_blocks_show', '_controller' => 'App\\Controller\\BlockController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_blocks_update', '_controller' => 'App\\Controller\\BlockController::update'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, true, null],
            [['_route' => 'api_blocks_delete', '_controller' => 'App\\Controller\\BlockController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        171 => [[['_route' => 'api_blocks_reorder', '_controller' => 'App\\Controller\\BlockController::reorder'], [], ['POST' => 0], null, false, false, null]],
        208 => [[['_route' => 'api_comments_list', '_controller' => 'App\\Controller\\CommentController::list'], ['articleId'], ['GET' => 0], null, false, true, null]],
        227 => [
            [['_route' => 'api_comments_update', '_controller' => 'App\\Controller\\CommentController::update'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_comments_delete', '_controller' => 'App\\Controller\\CommentController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        260 => [[['_route' => 'api_datasets_show', '_controller' => 'App\\Controller\\DatasetController::show'], ['id'], ['GET' => 0], null, false, true, null]],
        278 => [[['_route' => 'api_datasets_update_variables', '_controller' => 'App\\Controller\\DatasetController::updateVariables'], ['id'], ['PATCH' => 0], null, false, false, null]],
        293 => [[['_route' => 'api_datasets_upload', '_controller' => 'App\\Controller\\DatasetController::upload'], [], ['POST' => 0], null, false, false, null]],
        321 => [[['_route' => 'api_datasets_validate', '_controller' => 'App\\Controller\\DatasetController::validate'], ['id'], ['POST' => 0], null, false, false, null]],
        329 => [
            [['_route' => 'api_datasets_update', '_controller' => 'App\\Controller\\DatasetController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_datasets_delete', '_controller' => 'App\\Controller\\DatasetController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        373 => [[['_route' => 'api_google_sheets_get_players', '_controller' => 'App\\Controller\\GoogleSheetsController::getPlayers'], ['game'], ['GET' => 0], null, false, true, null]],
        397 => [[['_route' => 'api_google_sheets_get_matches', '_controller' => 'App\\Controller\\GoogleSheetsController::getMatches'], ['game'], ['GET' => 0], null, false, true, null]],
        429 => [[['_route' => 'api_google_sheets_import_replace', '_controller' => 'App\\Controller\\GoogleSheetsController::importReplaceDataset'], ['id'], ['POST' => 0], null, false, true, null]],
        455 => [[['_route' => 'api_media_show', '_controller' => 'App\\Controller\\MediaController::show'], ['id'], ['GET' => 0], null, false, true, null]],
        469 => [[['_route' => 'api_media_upload', '_controller' => 'App\\Controller\\MediaController::upload'], [], ['POST' => 0], null, false, false, null]],
        488 => [
            [['_route' => 'api_media_update', '_controller' => 'App\\Controller\\MediaController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'api_media_delete', '_controller' => 'App\\Controller\\MediaController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        528 => [
            [['_route' => 'api_ratings_article_ratings', '_controller' => 'App\\Controller\\RatingController::getArticleRatings'], ['articleId'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_ratings_rate_article', '_controller' => 'App\\Controller\\RatingController::rateArticle'], ['articleId'], ['POST' => 0], null, false, true, null],
        ],
        554 => [
            [['_route' => 'api_ratings_block_ratings', '_controller' => 'App\\Controller\\RatingController::getBlockRatings'], ['blockId'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_ratings_rate_block', '_controller' => 'App\\Controller\\RatingController::rateBlock'], ['blockId'], ['POST' => 0], null, false, true, null],
        ],
        571 => [[['_route' => 'api_ratings_delete', '_controller' => 'App\\Controller\\RatingController::delete'], ['id'], ['DELETE' => 0], null, false, true, null]],
        601 => [
            [['_route' => 'api_themes_show', '_controller' => 'App\\Controller\\ThemeController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_themes_update', '_controller' => 'App\\Controller\\ThemeController::update'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, true, null],
            [['_route' => 'api_themes_delete', '_controller' => 'App\\Controller\\ThemeController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        621 => [[['_route' => 'api_themes_activate', '_controller' => 'App\\Controller\\ThemeController::activate'], ['id'], ['POST' => 0], null, false, false, null]],
        641 => [[['_route' => 'api_themes_set_default', '_controller' => 'App\\Controller\\ThemeController::setDefault'], ['id'], ['POST' => 0], null, false, false, null]],
        672 => [[['_route' => 'api_themes_get_default', 'scope' => 'global', '_controller' => 'App\\Controller\\ThemeController::getDefault'], ['scope'], ['GET' => 0], null, false, true, null]],
        698 => [[['_route' => 'api_users_show', '_controller' => 'App\\Controller\\UserController::show'], ['id'], ['GET' => 0], null, false, true, null]],
        714 => [[['_route' => 'api_users_register', '_controller' => 'App\\Controller\\UserController::register'], [], ['POST' => 0], null, false, false, null]],
        724 => [[['_route' => 'api_users_profile', '_controller' => 'App\\Controller\\UserController::profile'], [], ['GET' => 0], null, false, false, null]],
        752 => [[['_route' => 'api_users_update_roles', '_controller' => 'App\\Controller\\UserController::updateRoles'], ['id'], ['PATCH' => 0], null, false, false, null]],
        772 => [[['_route' => 'api_users_update_subscription', '_controller' => 'App\\Controller\\UserController::updateSubscription'], ['id'], ['PATCH' => 0], null, false, false, null]],
        781 => [[['_route' => 'api_users_delete', '_controller' => 'App\\Controller\\UserController::delete'], ['id'], ['DELETE' => 0], null, false, true, null]],
        820 => [
            [['_route' => 'api_visualizations_show', '_controller' => 'App\\Controller\\VisualizationController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_visualizations_update', '_controller' => 'App\\Controller\\VisualizationController::update'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, true, null],
            [['_route' => 'api_visualizations_delete', '_controller' => 'App\\Controller\\VisualizationController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        834 => [
            [['_route' => 'api_visualizations_types', '_controller' => 'App\\Controller\\VisualizationController::types'], [], ['GET' => 0], null, false, false, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
