using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace BrowserBlast.Hubs
{
	public class GameHub : Hub
	{
		private static List<string> ConnectionIds = new List<string>();
		public override Task OnConnected()
		{
			ConnectionIds.Add(Context.ConnectionId);
			Clients.AllExcept(Context.ConnectionId).addPointer(Context.ConnectionId);
			return base.OnConnected();
		}
		public override Task OnDisconnected(bool stopCalled)
		{
			ConnectionIds.Remove(Context.ConnectionId);
			Clients.All.removePointer(Context.ConnectionId);
			return base.OnDisconnected(stopCalled);
		}
		public override Task OnReconnected()
		{
			if (!ConnectionIds.Contains(Context.ConnectionId))
			{
				ConnectionIds.Add(Context.ConnectionId);
				Clients.AllExcept(Context.ConnectionId).addPointer(Context.ConnectionId);
			}
			return base.OnReconnected();
		}
		public void UpdatePointer(int newX, int newY)
		{
			Clients.AllExcept(Context.ConnectionId).updatePointer(Context.ConnectionId, newX, newY);
		}
	}
}