using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoardGameCafe.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedFullDescriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE [BoardGames] SET [FullDescription] = 'Catan is a classic resource management and trading game set on a modular hex-tile island. Players collect wood, brick, wheat, sheep, and ore to build roads, settlements, and cities. Trading with other players is key — diplomacy and negotiation are just as important as strategy. No two games are ever the same thanks to the randomised board setup. A must-play for anyone new to modern board gaming.'
                WHERE [Title] = 'Catan' AND [FullDescription] = '';

                UPDATE [BoardGames] SET [FullDescription] = 'Ticket to Ride is a cross-country train adventure where players collect sets of coloured train cards and use them to claim railway routes across a sprawling map. Secret destination tickets give each player hidden goals, and completing long routes scores big bonus points. Easy to learn in minutes but with surprising strategic depth, it is one of the best gateways into the hobby for families and new players.'
                WHERE [Title] = 'Ticket to Ride' AND [FullDescription] = '';

                UPDATE [BoardGames] SET [FullDescription] = 'Pandemic is a fully cooperative game where players take on specialist roles — Medic, Scientist, Dispatcher, and more — and work together to contain four deadly diseases spreading across the globe. Every turn the infection intensifies, and outbreaks can cascade out of control if the team does not plan carefully. Communication and coordination are essential. Win or lose together, every game tells a tense story of humanity fighting back.'
                WHERE [Title] = 'Pandemic' AND [FullDescription] = '';

                UPDATE [BoardGames] SET [FullDescription] = 'Codenames is a clever word-association party game for two rival teams. A grid of 25 codename cards lies on the table, and each team''s spymaster knows which words belong to their agents. Spymasters give one-word clues to lead their teammates to the right cards — but one wrong guess and you might hand victory to the other side, or worse, uncover the assassin. Fast, funny, and perfect for large groups of any experience level.'
                WHERE [Title] = 'Codenames' AND [FullDescription] = '';

                UPDATE [BoardGames] SET [FullDescription] = 'Azul is an elegant tile-drafting game inspired by the decorative azulejo tiles of Portuguese palaces. Players take turns selecting colourful tiles from shared factory displays and placing them on their personal player boards to complete rows and patterns. Points are scored for completed lines and bonus patterns, but unplaced tiles incur penalties. With gorgeous components and satisfying tactical choices, Azul appeals equally to casual players and strategic thinkers.'
                WHERE [Title] = 'Azul' AND [FullDescription] = '';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE [BoardGames] SET [FullDescription] = ''
                WHERE [Title] IN ('Catan', 'Ticket to Ride', 'Pandemic', 'Codenames', 'Azul');
            ");
        }
    }
}
