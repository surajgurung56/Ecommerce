namespace Backend.Socket
{
    using System.Net.WebSockets;
    using System.Text;

    namespace Backend.Sockets
    {
        public class WebSocketHandler
        {
            private static readonly List<WebSocket> _sockets = new();

            //public async Task HandleAsync(WebSocket webSocket, CancellationToken cancellationToken)
            //{
            //    _sockets.Add(webSocket);
            //    Console.WriteLine("WebSocket connection established");

            //    var sendTask = SendPeriodicMessagesAsync(webSocket, cancellationToken);
            //    var receiveTask = ReceiveMessagesAsync(webSocket, cancellationToken);

            //    await Task.WhenAny(sendTask, receiveTask);

            //    _sockets.Remove(webSocket);
            //}

            public async Task HandleAsync(WebSocket webSocket, CancellationToken cancellationToken)
            {
                _sockets.Add(webSocket);
                Console.WriteLine("WebSocket connection established");

                var buffer = new byte[1024 * 4];

                try
                {
                    while (!cancellationToken.IsCancellationRequested && webSocket.State == WebSocketState.Open)
                    {
                        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);

                        if (result.MessageType == WebSocketMessageType.Close)
                        {
                            Console.WriteLine("Client requested close");
                            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", cancellationToken);
                            break;
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine("WebSocket operation canceled.");
                }
                finally
                {
                    _sockets.Remove(webSocket);
                }
            }

            public static async Task BroadcastAsync(string message)
            {
                Console.WriteLine("Inside BroadcastAsync: " + message);
                var buffer = Encoding.UTF8.GetBytes(message);

                foreach (var socket in _sockets.ToList())
                {
                    Console.WriteLine("Inside for each: ");
                    if (socket.State == WebSocketState.Open)
                    {
                        Console.WriteLine("Inside if: ");
                        await socket.SendAsync(
                        new ArraySegment<byte>(buffer),
                            WebSocketMessageType.Text,
                            true,
                            CancellationToken.None
                        );
                    }
                }
            }

            private async Task SendPeriodicMessagesAsync(WebSocket webSocket, CancellationToken cancellationToken)
            {
                while (!cancellationToken.IsCancellationRequested && webSocket.State == WebSocketState.Open)
                {
                    var message = "Hello";
                    var buffer = Encoding.UTF8.GetBytes(message);

                    await webSocket.SendAsync(
                        new ArraySegment<byte>(buffer),
                        WebSocketMessageType.Text,
                        true,
                        cancellationToken
                    );

                    Console.WriteLine($"Sent: {message}");

                    try
                    {
                        await Task.Delay(TimeSpan.FromMinutes(1), cancellationToken);
                    }
                    catch (TaskCanceledException)
                    {
                        break;
                    }
                }
            }

            private async Task ReceiveMessagesAsync(WebSocket webSocket, CancellationToken cancellationToken)
            {
                var buffer = new byte[1024 * 4];

                while (!cancellationToken.IsCancellationRequested && webSocket.State == WebSocketState.Open)
                {
                    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);

                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        Console.WriteLine("Client requested close");
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", cancellationToken);
                        break;
                    }
                }
            }

        }
    }
}
