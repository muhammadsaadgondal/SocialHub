// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Read connection string from environment variable
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({ 
        success: false, 
        message: 'MONGODB_URI environment variable is not defined' 
      }, { status: 500 });
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    
    // Get connection status
    const connectionState = mongoose.connection.readyState;
    
    // Check connection status
    let statusMessage;
    switch (connectionState) {
      case 0:
        statusMessage = 'Disconnected';
        break;
      case 1:
        statusMessage = 'Connected';
        break;
      case 2:
        statusMessage = 'Connecting';
        break;
      case 3:
        statusMessage = 'Disconnecting';
        break;
      default:
        statusMessage = 'Unknown';
    }
    
    return NextResponse.json({ 
      success: connectionState === 1,
      message: `MongoDB connection status: ${statusMessage}`,
      details: {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        models: Object.keys(mongoose.models)
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}