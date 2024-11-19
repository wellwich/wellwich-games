const Header = () => {
	return (
		<header>
			<h1 class="text-4xl font-bold">wellwich Games</h1>
			<nav>
				<ul class="flex space-x-4">
					<li>
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/games">Games</a>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
