<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Dashboard</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/admin.js'])
</head>
<body class="bg-gray-100">
    <div class="flex h-screen bg-gray-200">
        <!-- Sidebar -->
        @include('layouts.partials.admin-sidebar')

        <div class="flex flex-col flex-1">
            <!-- Header -->
            @include('layouts.partials.admin-header')

            <!-- Main content -->
            <main class="flex-1 p-4">
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
